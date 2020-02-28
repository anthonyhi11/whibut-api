const express = require('express');
const TvService = require('./tv-service');
const xss = require('xss');
const path = require('path');
const { requireAuth } = require('../jwt-auth/jwt-auth');

const tvRouter = express.Router();
const jsonBodyParser = express.json();

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

tvRouter 
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    TvService.getAllTv(
      req.app.get('db'),
      req.user.id
    )
      .then(show => {
        res.json(show.map(serializeTv))
      })
    .catch(next)
    })
  .post(jsonBodyParser, (req, res, next) => {
    const { activity, title, genre, network, rating } = req.body;
    const newTv = { activity, title, genre, network, rating };

    for (const [key, value] of Object.entries(newTv)) {
      if (value == null) {
        return res.status(400).json({ error: `Missing ${key} in request body`})
      }
    };
    newTv.user_id = req.user.id;
    newTv.comments = req.body.comments;
    TvService.addTv(
      req.app.get('db'),
      newTv
    )
    .then(show => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `${show.id}`))
        .json(serializeTv(show))
    })
  })

  module.exports = tvRouter;