const express = require('express');
const RestaurantsService = require('./restaurants-service');
const xss = require('xss');
const path = require('path');
const { requireAuth } = require('../jwt-auth/jwt-auth');

const restaurantsRouter = express.Router();
const jsonBodyParser = express.json();

const serializeRestaurant = restaurant => ({
  id: restaurant.id,
  user_id: restaurant.user_id ,
  activity: xss(restaurant.activity),
  restaurant_name: xss(restaurant.restaurant_name), 
  restaurant_type: xss(restaurant.restaurant_type),
  rating: restaurant.rating,
  website: xss(restaurant.website),
  comments: xss(restaurant.comments)
})

restaurantsRouter 
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    RestaurantsService.getAllRestaurants(
      req.app.get('db'),
      req.user.id
    )
      .then(restaurants => {
        res.json(restaurants.map(serializeRestaurant))
      })
    .catch(next)
    })
  .post(jsonBodyParser, (req, res, next) => {
    const { activity, restaurant_name, restaurant_type, rating } = req.body;
    const newRestaurant = { activity, restaurant_name, restaurant_type, rating };
    for (const [key, value] of Object.entries(newRestaurant)) {
      if (value == null) {
        return res.status(400).json({ error: `Missing ${key} in requst body`})
      }
    };
    newRestaurant.user_id = req.user.id;
    newRestaurant.website = req.body.website;
    newRestaurant.comments = req.body.comments;

    RestaurantsService.addRestaurant(
      req.app.get('db'),
      newRestaurant
    )
      .then(restaurant => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${restaurant.id}`))
          .json(serializeRestaurant(restaurant))
      })
      .catch(next);
  })

  restaurantsRouter
    .route('/:restId')
    .all(requireAuth, (req, res, next) => {
      RestaurantsService.getById(
        req.app.get('db'),
        req.params.restId,
        req.user.id
      )
      .then(rest => {
        if (!rest) {
          res.status(404).json({
            error: `Restaurant not found!`
          })
        }
        res.rest = rest;
        next();
      })
    })
    .get((req, res, next) => {
      res
        .status(200)
        .json(serializeRestaurant(res.rest))
    })
    .delete((req, res, next) => {
      RestaurantsService.deleteRest(
        req.app.get('db'),
        req.params.restId
      )
      .then(numRowsAffected => {
        return res.status(204).end();
      })
      .catch(next);
    })

  module.exports = restaurantsRouter;