const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config')

const LoginService = {
  getUserWithUsername(db, username) {
    return db
      .select('*')
      .from('whibut_users')
      .where('username', username)
      .first()
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    })
  },
}


module.exports = LoginService