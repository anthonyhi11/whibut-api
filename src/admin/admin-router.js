const express = require('express');
const adminRouter = express.Router();
const xss = require('xss');
const AdminService = require('./admin-service');
const { requireAuth } = require('../jwt-auth/jwt-auth');

const serializeUsers = user => ({
  username: xss(user.username),
  id: user.id
})

adminRouter
  .route('/')
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

  module.exports = adminRouter;