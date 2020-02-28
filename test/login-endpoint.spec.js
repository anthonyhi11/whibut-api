const knex = require('knex');
const jwt = require('jsonwebtoken');
const { makeUsersArray, cleanTables, seedUsers } = require('./test-helpers');
const app = require('../src/app');

describe.only(`Login Endpoints`, () => {
  let db 
const testUsers = makeUsersArray();
const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection:process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => cleanTables(db))

  afterEach('cleanup', () => cleanTables(db))

  describe('post /api/login', () => {
    beforeEach('insert users', () => {
      seedUsers(db, testUsers)
    });

    const requiredFields = ['username', 'password']

    requiredFields.forEach(field => {
      const loginAttempt = {
        username: testUser.username,
        password: testUser.password,
      }

    it(`responds with 400 when ${field} is missing`, () => {
      delete loginAttempt[field]

      return supertest(app)
        .post('/api/login')
        .send(loginAttempt)
        .expect(400, {
          error: `Missing '${field}' in request body`
        })
      });
    });

    it('responds 400 when bad username', () => {
      const invalidUser = {
        username: 'not', 
        password: 'exists'
      }
      return supertest(app)
        .post('/api/login')
        .send(invalidUser)
        .expect(400, {
          error: `Incorrect username or password`
        })
    });

    it('responds 400 when bad pass', () => {
      const invalidPass = {
        username: testUser.username,
        password: 'bad', 
      }
      return supertest(app) 
        .post('/api/login')
        .send(invalidPass)
        .expect(400, {
          error: `Incorrect username or password`
        })
    });

    it('responds with 200 and JWT auth token when valid', () => {
      const userValidCreds = {
        username: testUser.username,
        password: testUser.password,
      }
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          algorithm: "HS256",
        }
      )
      return supertest(app)
        .post('/api/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken
        })
    })
  })
})