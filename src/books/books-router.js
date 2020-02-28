const express = require('express');
const BooksService = require('./books-service');
const xss = require('xss');
const path = require('path');
const { requireAuth } = require('../jwt-auth/jwt-auth')

const booksRouter = express.Router();
const jsonBodyParser = express.json();

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

booksRouter 
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    BooksService.getAllBooks(
      req.app.get('db'),
      req.user.id
    )
      .then(books => {
        res.json(books.map(serializeBook))
      })
    .catch(next)
    })
  .post(jsonBodyParser, (req, res, next) => {
    const { title, author, genre, rating, activity } = req.body;
    const newBook = { title, author, genre, rating, activity }

    for (const [key, value] of Object.entries(newBook)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing ${key} in request body`
        })
      }
    };
    newBook.user_id = req.user.id
    newBook.comments = req.body.comments

    BooksService.addBook(
      req.app.get('db'),
      newBook
    )
    .then(book => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${book.id}`))
        .json(serializeBook(book))
    })
    .catch(next)
  })

  module.exports = booksRouter;