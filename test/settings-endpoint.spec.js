require('dotenv').config()
const knex = require('knex')
const { makeUsersArray, cleanTables, seedUsers, createJwt } = require('./test-helpers')
const app = require('../src/app')

describe.skip('Settings endpoint', function() {
let db 

const testUsers = makeUsersArray();
const testUser = testUsers[0]
const sub = testUser.username
const payload = { user_id: testUser.id }

before('make knex', () => {
  db = knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  })
  app.set('db', db)
})

after('disconnect db', () => db.destroy())

before('cleanup', () => cleanTables(db))

afterEach('cleanup', () => cleanTables(db))


  describe('PATCH /api/settings', () => { 
    context('validation', () => {
      beforeEach('insert users', () =>
        seedUsers(
          db, 
          testUsers,
        )
      )

        const requiredFields = ['username', 'password', 'password_confirm']
  
        requiredFields.forEach(field => {
          const patchAttempt = 
            { 
              username: 'ussername',
              password: 'AA11!!aa',
              password_confirm: 'AA1111aa'
            }
         
          
          it(`responds with 400 when missing ${field}`, () => {
            delete patchAttempt[field]
   
            return supertest(app)
             .patch('/api/settings')
             .set('Authorization', createJwt(sub, payload))
             .send(patchAttempt, 1)
             .expect(400, {
               error: `Missing ${field}`
             })
           });
        })
    })
  })
})


