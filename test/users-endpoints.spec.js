const knex = require('knex')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const { expect } = require('chai')

const app = require('../src/app')
const helpers = require('./test-helpers')


describe('Users endpoints', () => {

  let db

  const { testUsers } = helpers.makeTestFixtures()
  const testUser = testUsers[0]

  before('create knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('cleanup', () => helpers.cleanTables(db))

  after('destroy connection', () => db.destroy())

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/users', () => {
    context('User Validation', () => {
      beforeEach('insert users', () => {
        helpers.seedUsers(db, testUsers)
      })

      const requiredFields = ['first_name', 'last_name', 'username', 'email', 'password']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          first_name: 'john',
          last_name: 'doe',
          username: 'discman',
          email: 'john.doe@email.com',
          password: 'password'
        }
        it(`responds 400 required error when ${field} is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
      })
      it('responds 400 "password must be longer than 8 characters" when empty password', () => {
        const userShortPassword = {
          first_name: 'john',
          last_name: 'doe',
          username: 'discman',
          email: 'john.doe@email.com',
          password: '1234567'
        }

        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, {
            error: { message: 'Password must be longer than 8 characters' }
          })
      })
      it('responds 400 "password must be less than 72 characters" when long password', () => {
        const userLongPassword = {
          first_name: 'john',
          last_name: 'doe',
          username: 'discman',
          email: 'john.doe@email.com',
          password: '*'.repeat(73)
        }

        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, {
            error: { message: 'Password must be less than 72 characters' }
          })
      })
      it('responds 400 error when password starts with spaces', () => {
        const userSpacePassword = {
          first_name: 'john',
          last_name: 'doe',
          username: 'discman',
          email: 'john.doe@email.com',
          password: ' not-valid'
        }

        return supertest(app)
          .post('/api/users')
          .send(userSpacePassword)
          .expect(400, {
            error: { message: 'Password must not start or end with empty space' }
          })
      })
      it('responds 400 error when password ends with a space', () => {
        const userSpacePassword = {
          first_name: 'john',
          last_name: 'doe',
          username: 'discman',
          email: 'john.doe@email.com',
          password: 'not-valid '
        }

        return supertest(app)
          .post('/api/users')
          .send(userSpacePassword)
          .expect(400, {
            error: { message: 'Password must not start or end with empty space' }
          })
      })
      it('responds 400 error when password isn\'t complex enough', () => {
        const userPasswordNotComplex = {
          first_name: 'john',
          last_name: 'doe',
          username: 'discman',
          email: 'john.doe@email.com',
          password: '11AAaabb'
        }

        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, {
            error: { message: 'Password must contain 1 upper case, lower case, number and special character' }
          })
      })
      it('responds "username already taken" when username isn\'t unique', () => {
        const duplicateUser = {
          first_name: 'john',
          last_name: 'doe',
          username: testUser.username,
          email: 'john.doe@email.com',
          password: '11AAaa!!',
        }

        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, {
            error: { message: 'Username already taken' }
          })
      })
    })
    context('Happy Path', () => {
      it('responds 201, serialized user, storing bcrypted password', function() {
        this.retries(3)

        const newUser = {
          first_name: 'john',
          last_name: 'doe',
          username: 'discman',
          email: 'john.doe@email.com',
          password: '11AAaabb!!'
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(newUser.username)
            expect(res.body.first_name).to.eql(newUser.first_name)
            expect(res.body.last_name).to.eql(newUser.last_name)
            expect(res.body.email).to.eql(newUser.email)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
            const expectedDate = new Date().toLocaleString()
            const actualDate = new Date(res.body.date_created).toLocaleString()
            expect(actualDate).to.eql(expectedDate)
          })
          .expect(res => {
            db('users')
              .select('*')
              .where({id : res.body.id})
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username)
                expect(row.first_name).to.eql(newUser.first_name)
                expect(row.last_name).to.eql(newUser.last_name)
                expect(row.email).to.eql(newUser.email)
                const expectedDate = new Date().toLocaleString()
                const actualDate = new Date(row.date_created).toLocaleString()
                expect(actualDate).to.eql(expectedDate)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(comapreMatch => {
                expect(comapreMatch).to.be.true
              })
          })
      })
    })
  })
})
