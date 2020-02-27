const bcrypt = require('bcryptjs');

function makeUsersArray() {
  return [
    {
      id: 1, 
      username: 'test-user1',
      password:'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2, 
      username: 'test-user2',
      password:'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3, 
      username: 'test-user3',
      password:'password',
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

module.exports = {
  makeUsersArray,
  seedUsers, 
  cleanTables
}