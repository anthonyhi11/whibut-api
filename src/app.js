require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const booksRouter = require('./books/books-router');
const moviesRouter = require('./movies/movies-router');
const tvRouter = require('./tv/tv-router');
const restaurantsRouter = require('./restaurants/restaurants-router');
const usersRouter = require('./users/users-router');
const loginRouter = require('./login/login-router');
const adminRouter = require('./admin/admin-router');
const app = express();


const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

  app.use(morgan(morganOption));
  app.use(helmet());
  app.use(cors());



  app.use('/api/books', booksRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/tv', tvRouter);
  app.use('/api/restaurants', restaurantsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/login', loginRouter);
  app.use('/api/admin', adminRouter)

  app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'Server Error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
  })

  module.exports = app;