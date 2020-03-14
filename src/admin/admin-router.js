const express = require('express');
const adminRouter = express.Router();
const xss = require('xss');
const AdminService = require('./admin-service');
const { requireAuth } = require('../jwt-auth/jwt-auth');

const serializeUsers = user => ({
  username: xss(user.username),
  id: user.id
})

const serializeMovie = movie => ({
  id: movie.id,
  user_id: movie.user_id ,
  activity: xss(movie.activity),
  title: xss(movie.title), 
  genre: xss(movie.genre),
  rating: movie.rating,
  comments: xss(movie.comments)
})
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

const serializeBook = book => ({
  id: book.id,
  user_id: book.user_id ,
  activity: xss(book.activity),
  title: xss(book.title), 
  author: xss(book.author), 
  genre: xss(book.genre),
  rating: book.rating,
  comments: xss(book.comments)
})
const serializeTv = tv => ({
  id: tv.id,
  user_id: tv.user_id ,
  activity: xss(tv.activity),
  title: xss(tv.title), 
  genre: xss(tv.genre),
  network: xss(tv.network),
  rating: tv.rating,
  comments: xss(tv.comments)
})

adminRouter
  .route('/users')
  .all(requireAuth)
  .get((req, res, next) => {
    if (req.user.id !== 1) {
      return res.status(400).json({error: 'Unauthorized'})
    }
    AdminService.getAllUsers(
      req.app.get('db')
    )
    .then(users => {
      res.json(users.map(serializeUsers))
    })
    .catch(next)
  })

  adminRouter
    .route('/movies')
    .all(requireAuth)
    .get((req, res, next) => {
      if (req.user.id !== 1) {
        return res.status(400).json({error: 'Unauthorized'})
      }
      AdminService.getAllMovies(
        req.app.get('db')
      )
      .then(movies => {
        res.json(movies.map(serializeMovie))
      })  
      .catch(next)
    })

    adminRouter
    .route('/books')
    .all(requireAuth)
    .get((req, res, next) => {
      if (req.user.id !== 1) {
        return res.status(400).json({error: 'Unauthorized'})
      }
      AdminService.getAllBooks(
        req.app.get('db')
      )
      .then(books => {
        res.json(books.map(serializeBook))
      })  
      .catch(next)
    })

    adminRouter
    .route('/tv')
    .all(requireAuth)
    .get((req, res, next) => {
      if (req.user.id !== 1) {
        return res.status(400).json({error: 'Unauthorized'})
      }
      AdminService.getAllTv(
        req.app.get('db')
      )
      .then(shows => {
        res.json(shows.map(serializeTv))
      })  
      .catch(next)
    })

    adminRouter('/restaurants')
      .all(requireAuth)
      .get((req, res, next) => {
        if (req.user.id !== 1) {
          return res.status(400).json({ error: 'Unauthorized'})
        }
        AdminService.getAllRest(
          req.app.get('db')
        )
        .then(rests => {
          res.json(rests.map(serializeRestaurant))
        })
        .catch(next)
      })



  module.exports = adminRouter;