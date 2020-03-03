const knex = require('knex')
const { makeUsersArray, cleanTables, seedUsers, makeMoviesArray, seedMovies, createJwt } = require('./test-helpers');
const app = require('../src/app');

describe('movies endpoint', function() {
  let db 

  const testUsers = makeUsersArray();
  const testUser = testUsers[0];
  const testMovies = makeMoviesArray();
  const testMovie = testMovies[0];
  const sub = testUser.username;
  const payload = { user_id: testUser.id };

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect', () => db.destroy())

  before('cleanup', () => cleanTables(db))

  afterEach('cleanup', () => cleanTables(db))

  describe('GET movies', () => {
    context('No validation', () => {
      it('returns 401', () => {
        return supertest(app)
          .get('/api/movies')
          .expect(401)
      })
    })
    context('validated', () => {
      beforeEach('seed db', () => {
        seedUsers(db, testUsers)
        seedMovies(db, testMovies)
      })

      it('returns 200', () => {
        return supertest(app)
          .get('/api/movies')
          .set('Authorization', `bearer ${createJwt(sub, payload)}`)
          .expect(200)
      })
      // it('returns 200 with bookid', () => {
      //   return supertest(app)
      //     .get(`/api/movies/${testMovie.id}`)
      //     .set('Authorization', `bearer ${createJwt(sub, payload)}`)
      //     .expect(200)
      // })
    })
    context('POST', () => {
      beforeEach('seeds', () => seedUsers(db, testUsers))
      it('posts successfully', () => {
        const newMovie = {
          user_id: 1, 
          activity: 'movies',
          title: 'test',
          genre: 'test',
          rating: 1,
          comments: 'test'
        }
        return supertest(app)
          .post('/api/movies')
          .set('Authorization', `bearer ${createJwt(sub, payload)}`)
          .send(newMovie)
          .expect(201)
      })
    })
  })
})