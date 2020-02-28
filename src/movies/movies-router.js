const express = require('express');
const MoviesService = require('./movies-service');
const xss = require('xss');
const path = require('path');
const { requireAuth } = require('../jwt-auth/jwt-auth');

const moviesRouter = express.Router();
const jsonBodyParser = express.json();

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
  .all(requireAuth)
  .get((req, res, next) => {
    MoviesService.getAllMovies(
      req.app.get('db'),
      req.user.id
    )
      .then(movies => {
        res.json(movies.map(serializeMovie))
      })
    .catch(next)
    })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { activity, title, genre, rating } = req.body;
    const newMovie = { activity, title, genre, rating }
    for (const [key, value] of Object.entries(newMovie)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing ${key} in request body`
        })
      }
    };
    newMovie.user_id = req.user.id;
    newMovie.comments = req.body.comments;

    MoviesService.addMovie(
      req.app.get('db'),
      newMovie
    )
    .then(movie => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${movie.id}`))
        .json(serializeMovie(movie))
    })
    .catch(next);
  });

  moviesRouter
    .route('/:movieId')
    .all(requireAuth, (req, res, next) => {
      MoviesService.getById(
        req.app.get('db'),
        req.params.movieId,
        req.user.id
      )
      .then(movie => {
        if (!movie) {
          return res.status(404).json({
            error: `Movie not found!`
          })
        }
        res.movie = movie;
        next();
      })
    })
    .get((req, res, next) => {
      res
        .status(200)
        .json(serializeMovie(res.movie))
    })
    .delete((req, res, next) => {
      MoviesService.deleteMovie(
        req.app.get('db'),
        req.params.movieId
      )
      .then(numRowsAffected => {
        return res.status(204).end();
      })
    })

  module.exports = moviesRouter;