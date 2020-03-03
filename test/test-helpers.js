const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('../src/config')

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'testuser1',
      password:'Password123!',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_modified: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      username: 'testuser2',
      password:'Password123!',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      username: 'testuser3',
      password:'Password123!',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('whibut_users').insert(preppedUsers)
    .then(() => 
      db.raw(
        `SELECT setval('whibut_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function makeBooksArray() {
  return [
    {
      id: 1,
      user_id: 1,
      activity: 'books',
      title: 'Example',
      author: 'Example',
      genre: 'example',
      rating: 4,
      comments: 'example'
    },
    { id: 2,
      user_id: 1,
      activity: 'books',
      title: 'Example2',
      author: 'Example',
      genre: 'example',
      rating: 4,
      comments: 'example'
    },
    { id: 3,
      user_id: 1,
      activity: 'books',
      title: 'Example3',
      author: 'Example',
      genre: 'example',
      rating: 4,
      comments: 'example'
    }
  ]
}

function seedBooks(db, books) {
  return db
    .into('whibut_books')
    .insert(books)
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        whibut_users,
        whibut_books,
        whibut_movies,
        whibut_restaurants,
        whibut_tv
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE whibut_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE whibut_movies_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE whibut_restaurants_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE whibut_tv_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE whibut_books_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('whibut_users_id_seq', 0)`),
        trx.raw(`SELECT setval('whibut_books_id_seq', 0)`),
        trx.raw(`SELECT setval('whibut_movies_id_seq', 0)`),
        trx.raw(`SELECT setval('whibut_restaurants_id_seq', 0)`),
        trx.raw(`SELECT setval('whibut_tv_id_seq', 0)`),
      ])
    )
  )
}

function createJwt(subject, payload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    subject,
    algorithm: 'HS256',
  })
}

module.exports = {
  makeUsersArray,
  seedUsers, 
  cleanTables,
  seedBooks,
  makeBooksArray,
  createJwt
}