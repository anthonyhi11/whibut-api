require('dotenv');
const knex = require('knex')
const { makeUsersArray, cleanTables, seedUsers, makeBooksArray, seedBooks, createJwt  } = require('./test-helpers')
const app = require('../src/app')

describe('Books endpoint', function() {
  let db 

  const  testUsers = makeUsersArray();
  const testUser = testUsers[0]
  const testBooks = makeBooksArray();
  const testBook = testBooks[0];
  const sub = testUser.username
  const payload = { user_id: testUser.id } 
  

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

  describe('GET books', () => {
    context('doesnt have validation', () => {
      beforeEach('seedusers and books', () => {
        seedUsers(db, testUsers),
        seedBooks(db, testBooks)
      })
      it('returns 401 when no authorization', () => {
        return supertest(app)
        .get('/api/books')
        .expect(401) 
      })
    })
    context('has validation', () => {
      beforeEach('seedusers and books', () => {
        seedUsers(db, testUsers),
        seedBooks(db, testBooks)
      })
      it('returns 200 and list of requests', () => {
        return supertest(app)
          .get('/api/books')
          .set('Authorization', `bearer ${createJwt(sub, payload)}`).then(() => {
            expect(200)
          })
      })
    })
  })

  describe('POST books', () => {
    beforeEach('seedusers and books', () => {
      seedUsers(db, testUsers)
    })
    context('doesnt have validation', () => {

      it('throws a 401 when trying to post', () => {
        const goodBook = {
          user_id: 1,
          activity: 'books',
          title: 'Example',
          author: 'Example',
          genre: 'example',
          rating: 4,
          comments: 'example'
        }
        return supertest(app)
          .post('/api/books')
          .send(goodBook)
          .expect(401)
      })
      it('returns 201 after successful post', () => {
        const goodBook = {
          user_id: 1,
          activity: 'books',
          title: 'Example',
          author: 'Example',
          genre: 'example',
          rating: 4,
          comments: 'example'
        }
        return supertest(app)
          .post('/api/books')
          .set('Authorization', `bearer ${createJwt(sub, payload)}`)
          .send(goodBook).then(() => {
              expect(201)
          })
      })
    })
    
  })
  describe('bookId route', () => {
    beforeEach('seed users and books', () => {
      seedUsers(db, testUsers)
      seedBooks(db, testBooks)
    })
    it('GET request by bookid returns 200', () => {
      bookId = 1;
      return supertest(app)
        .get(`/api/books/${bookId}`)
        .set('Authorization', `bearer ${createJwt(sub, payload)}`).then(() => {
          expect(200)
        })
    })
    it('DELETES book by Id', () => {
      bookId=1;
      return supertest(app)
        .delete(`/api/books${bookId}`)
        .set('Authorization', `bearer ${createJwt(sub, payload)}`).then(() => {
          expect(201)
        })
    })
  })
})