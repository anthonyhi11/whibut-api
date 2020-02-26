const express = require('express');
const MoviesService = require('./movies-service');
const xss = require('xss');

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
  .get((req, res, next) => {
    MoviesService.getAllMovies(
      req.app.get('db'),
      1
    )
      .then(movies => {
        res.json(movies.map(serializeMovie))
      })
    .catch(next)
    })

  module.exports = moviesRouter;