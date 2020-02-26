const express = require('express');
const RestaurantsService = require('./restaurants-service');
const xss = require('xss');

const restaurantsRouter = express.Router();
const jsonParser = express.json();

const serializeRestaurant = restaurant => ({
  id: restaurant.id,
  user_id: restaurant.user_id ,
  activity: xss(restaurant.activity),
  name: xss(restaurant.name), 
  type: xss(restaurant.type),
  rating: restaurant.rating,
  website: xss(restaurant.website),
  comments: xss(restaurant.comments)
})

restaurantsRouter 
  .route('/')
  .get((req, res, next) => {
    RestaurantsService.getAllRestaurants(
      req.app.get('db'),
      1
    )
      .then(restaurants => {
        res.json(restaurants.map(serializeRestaurant))
      })
    .catch(next)
    })

  module.exports = restaurantsRouter;