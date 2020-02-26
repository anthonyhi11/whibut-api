const express = require('express');
const TvService = require('./tv-service');
const xss = require('xss');

const tvRouter = express.Router();
const jsonParser = express.json();

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
  .get((req, res, next) => {
    TvService.getAllTv(
      req.app.get('db'),
      1
    )
      .then(show => {
        res.json(show.map(serializeTv))
      })
    .catch(next)
    })

  module.exports = tvRouter;