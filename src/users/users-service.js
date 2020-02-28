const xss = require('xss');
const bcrypt = require('bcryptjs');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  validatePassword(password) { //validating password
    if (password.length < 8) {
      return `Password must be more than 8 characters`
    }
    if (password.length > 72) {
      return `Password must be less than 72 characters`  
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return `Password cannot start or end with spaces`
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number, and special character'
    }
    return null
  },
  //check this one again when writing tests, it checks the database for if a user exists
  hasUsername(knex, username) {
    return knex
        .select('*')
        .from('whibut_users')
        .where('username', username)
        .first()
        .then(user => !!user)
  },
  hashPassword(password) { //hashing password before inserting into database
    return bcrypt.hash(password, 12)
  },
  insertUser(knex, newUser) { //inserting user
    return knex
      .insert(newUser)
      .into('whibut_users')
      .returning('*')
      .then(([user]) => user) //this piece of logic is fuzzy to me
  },
  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      date_created: new Date(user.date_created)
    }
  }, 
  getById(knex, userId, id) {
    return knex
      .select('*')
      .from('whibut_users')
      .where('id', id)
      .where('id', userId)
      .first()
  },
  updateUser(knex, id, updatedUser) {
    return knex('whibut_users')
      .where({ id })
      .update(updatedUser)
      .returning('*')
      .then(([user]) => user)
  }
}

module.exports = UsersService

