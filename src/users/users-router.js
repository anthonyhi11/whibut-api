const express = require('express');
const path = require('path');
const usersRouter = express.Router();
const jsonBodyParser = express.json();
const UsersService = require('./users-service');
const { requireAuth } = require('../jwt-auth/jwt-auth');

//handles signup and adding user to database. need to add patch user to this

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const { username, password, password_confirm } = req.body;
    //verify request contains all relevant required inputs
    for (const field of ['username', 'password', 'password_confirm'])
      if (!req.body[field]) {
        return res.status(400).json({
          error: { message: `Missing ${field}`}
        })
      } //ensure the password and password confirm match
      if (password !== password_confirm) {
        return res.status(400).json({
          error: { message: `Passwords do not match` }
        })
      }
      //validate password
      const passwordError = UsersService.validatePassword(password)
      if (passwordError) {
        return res.status(400).json({
          error: {message: passwordError}
        })
      }
      //checks username is not in database
    UsersService.hasUsername(
      req.app.get('db'),
      username)
        .then(hasUsername => {
          if (hasUsername) {
            return res.status(400).json({ error: `Username already taken` })
          }
        })
      return UsersService.hashPassword(password) //hashing password
        .then(hashedPassword => {
          const newUser = {
            username, 
            password: hashedPassword,
            date_created: 'now()'
          }
          return UsersService.insertUser( //inserting new user in to database with hashed password
            req.app.get('db'),
            newUser
          ).then(user => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user))
          })
        })
        .catch(next);
  })

  usersRouter
    .route('/:userId')
    .all(requireAuth, (req, res, next) => {
      UsersService.getById(
        req.app.get('db'),
        req.params.userId,
        req.user.id
      )
      .then(user => {
        if (!user) {
          return res.status(404).json({ 
            error: `User not found`
          })
        }
        res.user = user;
        next();
      }) //getById to verify it's available to edit. 
    })
    .patch(jsonBodyParser, (req, res, next) => {
      const { username, password, password_confirm } = req.body;
    //verify request contains all relevant required inputs
    for (const field of ['username', 'password', 'password_confirm'])
      if (!req.body[field]) {
        return res.status(400).json({
          error: { message: `Missing ${field}`}
        })
      } //ensure the password and password confirm match
      if (password !== password_confirm) {
        return res.status(400).json({
          error: { message: `Passwords do not match` }
        })
      }
      //validate password
      const passwordError = UsersService.validatePassword(password)
      if (passwordError) {
        return res.status(400).json({
          error: {message: passwordError}
        })
      }
      //checks username is not in database if username is changing 
     if (username !== req.user.username) {
      UsersService.hasUsername(
        req.app.get('db'),
        username)
          .then(hasUsername => {
            if (hasUsername) {
            return res.status(400).json({ error: `Username already taken` })
          }
        })
      }
      return UsersService.hashPassword(password) //hashing password
        .then(hashedPassword => {
          const updatedUser = {
            username, 
            password: hashedPassword,
            date_modified: 'now()'
          }
          return UsersService.updateUser(
            req.app.get('db'),
            req.user.id,
            updatedUser)
            .then(user => {
              res
              .status(204)
              .location(path.posix.join(req.originalUrl, `${user.id}`))
              .json(UsersService.serializeUser(res.user))
    })
  })
})
  

  module.exports = usersRouter