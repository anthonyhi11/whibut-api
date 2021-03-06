const bcrypt = require('bcryptjs');
const knex = require('knex')
const { makeUsersArray, cleanTables, seedUsers, createJwt } = require('./test-helpers');
const app = require('../src/app');

describe('User endpoint', function() {
  let db 

  const  testUsers = makeUsersArray();
  const testUser = testUsers[0]



  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => cleanTables(db));

  afterEach('cleanup', () => cleanTables(db));

  
  describe('POST /api/users', () => {
    context('user validation', () => {
      this.beforeEach('insert users', () =>
        seedUsers(
          db, 
          testUsers,
        )
      )

      const requiredFields = ['username', 'password', 'password_confirm']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'username',
          password: 'testpassword',
          password_confirm: 'testpassword'
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: { 
                message: `Missing ${field}`}
            })
        });
      })
      it('responds with 400 password must be more than 8 characters',  () => {
        const shortPass = {
          username: 'usermame', 
          password: 'short',
          password_confirm: 'short'
        }
        return supertest(app)
          .post('/api/users')
          .send(shortPass)
          .expect(400, {
            error: {
              message: `Password must be more than 8 characters`
            }
          })
      });

      it('responds with 400 when password is more than 72 characters', () => {
        const longPass = {
          username: 'username',
          password: '*'.repeat(73),
          password_confirm: '*'.repeat(73)
        }
        return supertest(app)
          .post('/api/users')
          .send(longPass)
          .expect(400, {
            error: {
              message: `Password must be less than 72 characters`
            }
          })
      });

      it('responds with 400 when password starts with spaces',  () => {
        const passWithSpacesStart = {
          username: 'username', 
          password: ' asdf34F3df',
          password_confirm: ' asdf34F3df',
        }
        return supertest(app)
          .post('/api/users')
          .send(passWithSpacesStart)
          .expect(400, {
            error: {
              message: `Password cannot start or end with spaces`
            }
          })
      });

      it('responds with 400 when password ends with spaces',  () => {
        const passWithSpacesEnd = {
          username: 'username', 
          password: 'asdf34F3df ',
          password_confirm: 'asdf34F3df ',
        }
        return supertest(app)
          .post('/api/users')
          .send(passWithSpacesEnd)
          .expect(400, {
            error: {
              message: `Password cannot start or end with spaces`
            }
          })
      });

      it('responds with 400 when pass isnt complex enough', () => {
        const simplePass = {
          username: 'username',
          password: 'sdfljlkjf',
          password_confirm: 'sdfljlkjf',
        }
        return supertest(app) 
          .post('/api/users')
          .send(simplePass)
          .expect(400, {
            error: {
              message: `Password must contain one upper case, lower case, number, and special character`
            }
          })
      });

      it('responds with 400 when username is taken', () => {
        const dupUser = {
          username: testUser.username,
          password: '1Adfjk@f',
          password_confirm: '1Adfjk@f'
        }
        return supertest(app)
          .post('/api/users')
          .send(dupUser)
          .expect(400, {
            error: `Username already taken`
          })   
      })
    });

    context('Happy path!', () => {
      it('responds with a 201, serialized user, storing bcrpyted pass', () => {
        const newUser = {
          username: 'testUsername',
          password: '11AAaa!!',
          password_confirm: '11AAaa!!'
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(newUser.username)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
            const expectedDate = new Date().toLocaleDateString('en', { timezone: 'UTC' })
            const actualDate = new Date(res.body.date_created).toLocaleDateString()
            expect(expectedDate).to.eql(actualDate)
          })
          .expect(res => 
            db
              .from('whibut_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username)
                const expectedDate = new Date().toLocaleDateString('en', { timeZone: 'UTC' })
                const actualDate = new Date(row.date_created).toLocaleDateString()
                expect(actualDate).to.eql(expectedDate)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
            )
      })
    })
  })

  
})

