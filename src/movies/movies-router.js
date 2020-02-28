const express = require('express');
const MoviesService = require('./movies-service');
const xss = require('xss');
const { requireAuth } = require('../jwt-auth/jwt-auth');

const moviesRouter = express.Router();
const jsonParser = express.json();

const serializeMovie = movie => ({
  id: movie.id,
  user_id: movie.user_id ,
  activity: xss(movie.activity),
  title: xss(movie.title), 
  genre: xss(movie.genre),
  rating: movie.rating,
  comments: xss(movie.comments)
})

moviesRouter 
  .route('/')
  .get(requireAuth, (req, res, next) => {
    MoviesService.getAllMovies(
      req.app.get('db'),
      req.user.id
    )
      .then(movies => {
        res.json(movies.map(serializeMovie))
      })
    .catch(next)
    })

  module.exports = moviesRouter;