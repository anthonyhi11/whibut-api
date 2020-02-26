const express = require('express');
const BooksService = require('./books-service');
const xss = require('xss');

const booksRouter = express.Router();
const jsonParser = express.json();

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
  .get((req, res, next) => {
    BooksService.getAllBooks(
      req.app.get('db'),
      1
    )
      .then(books => {
        res.json(books.map(serializeBook))
      })
    .catch(next)
    })

  module.exports = booksRouter;