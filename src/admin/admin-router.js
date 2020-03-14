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
      AdminService.getAllBooks(
        req.app.get('db')
      )
      .then(movies => {
        res.json(movies.map(serializeMovie))
      })  
      .catch(next)
    })

  module.exports = adminRouter;