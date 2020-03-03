require('dotenv')
const knex = require('knex')
const { makeUsersArray, cleanTables, seedUsers, makeRestArray, seedRests, createJwt } = require('./test-helpers')
const app = require('../src/app')

describe.only('restaurants endpoint', () => {
  let db 

  const  testUsers = makeUsersArray();
  const testUser = testUsers[0]
  const testRests = makeRestArray();
  const testRest = testRests[0];
  const sub = testUser.username
  const payload = { user_id: testUser.id }

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })
  after('disconnect', () => db.destroy())

  before('cleanup', () => cleanTables(db))

  afterEach('cleanup', () => cleanTables(db))

  describe('GET Restaurants', () => {
    context('No auth', () => {
      beforeEach('seeds', () => {
      seedUsers(db, testUsers)
      seedRests(db, testRests)
      })

      it('returns 401 when no validation', () => {
        return supertest(app)
          .get('/api/restaurants')
          .expect(401)
        })
    })
    context('has auth', () => {
      beforeEach('seeds', () => {
        seedUsers(db, testUsers)
        seedRests(db, testRests)
        })

      it('responds with 200', () => {
        return supertest(app)
          .get('/api/restaurants')
          .set('Authorization', `bearer ${createJwt(sub, payload)}`)
          .expect(200)
      })
    })
  })
  describe('POST restaurants', () => {
    beforeEach('seeds', () => {
      seedUsers(db, testUsers)
    })
    context('happy path', () => {
      it('responds 201 after successful post', () => {
        const goodRest = {
          "id": 1,
          "activity": "restaurants",
          "restaurant_name": "test",
          "restaurant_type": "test",
          "website": "nasdf",
          "rating": 1,
          "comments": "testaet"
        }
        return supertest(app)
          .post('/api/restaurants')
          .set('Authorization', `bearer ${createJwt(sub, payload)}`)
          .send(goodRest)
          .expect(201)
      })
    })
  })
})