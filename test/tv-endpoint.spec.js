require('dotenv');
const knex = require('knex')
const { makeUsersArray, cleanTables, seedUsers, makeTvArray, seedShows, createJwt } = require('./test-helpers')
const app = require('../src/app');

describe('TV endpoint', function() {
  let db
  const  testUsers = makeUsersArray();
  const testUser = testUsers[0]
  const testShows = makeTvArray();
  const testShow = testShows[0];
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

  describe('GET SHOWS', () => {
    context('doesnt have validation', () => {
      this.beforeEach('seedUsers and shows', () => {
        seedUsers(db, testUsers)
        seedShows(db, testShows)
      })

      it('returns 400 when no authorization', () => {
        return supertest(app)
          .get('/api/tv')
          .expect(401)
      })
    })
    context('has validation', () => {
      beforeEach('seedusers and shows', () => {
        seedUsers(db, testUsers)
        seedShows(db, testShows)
      })
      it('returns 200 and list of requests', () => {
        return supertest(app)
          .get('/api/tv')
          .set('Authorization', `bearer ${createJwt(sub, payload)}`)
          .expect(200)
      })
    })
  })
  describe('POST tv', () => {
    beforeEach('seeds users', () => {
      seedUsers(db, testUsers)
    })
    context('happy path', () => {
      it('returns 201 after successful post', () => {
        const goodTv = {
          "user_id": 1,
          "id": 1,
          "activity": "tv", 
          "title": "test",
          "genre": "test",
          "network": "network",
          "rating": 8,
          "comments": "test"
        }
        return supertest(app)
          .post('/api/tv')
          .set('Authorization', `bearer ${createJwt(sub, payload)}`)
          .send(goodTv)
          .expect(201)
      })
    })
  })

})