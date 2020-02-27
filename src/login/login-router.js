const express = require('express');
const LoginService = require('./login-service')

const loginRouter = express.Router();
const jsonBodyParser = express.json();

loginRouter 
  .route('/')
  .post(jsonBodyParser, (req,res, next) => {
    const { username, password } = req.body;
    const loginUser = { username, password};
  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      })
  LoginService.getUserWithUsername(
    req.app.get('db'),
    loginUser.username
  )
  .then(dbUser => {
    if (!dbUser) {
      return res.status(400).json({
        error: `Incorrect username or password`
      })
    }
    return LoginService.comparePasswords(loginUser.password, dbUser.password)
      .then(compareMatch => {
        if (!compareMatch) {
          return res.status(400).json({
            error: `Incorrect username or password`
          })
        }
        
        const sub = dbUser.username
        const payload = { user_id: dbUser.id }
        res.send({
          authToken: LoginService.createJwt(sub, payload),
        })
      })
    })
    .catch(next)
  })

module.exports = loginRouter