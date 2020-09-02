const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Bags Endpoints', () => {
  let db

  const { testUsers, testDiscs, testBagDiscs } = helpers.makeTestFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('cleanup', () => helpers.cleanTables(db))

  after('destroy connection', () => db.destroy())

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('GET /api/bags', () => {
    context('given no data', () => {
      beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

      it('responds 200 and empty list', () => {
        return supertest(app)
          .get('/api/bags')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })
    context('Given data', () => {
      beforeEach('Seed tables', () => {
        return helpers.seedBagDiscs(db, testDiscs, testUsers, testBagDiscs)
      })
      it('responds 200 and list of discs for valid user', () => {
        const validUser = testUser
        const expectedDiscs = helpers.makeExpectedUserBag(testBagDiscs, testDiscs, validUser.id)
        
        return supertest(app)
          .get('/api/bags')
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200, expectedDiscs)
      })
    })
  })
  describe.only('POST /api/bags', () => {
    beforeEach('seed data', () => 
      helpers.seedBagDiscs(db, testDiscs, testUsers, testBagDiscs)
    )
    const testUser = testUsers[2]

    it('responds 400 required error when missing disc_id in request body', () => {
      return supertest(app)
        .post('/api/bags')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(400, {
          error: { message: 'Missing disc_id in request body' }
        })
    })
    it('responds 400 "Invalid disc_id" when invalid disc_id in request body', () => {
      const invalidRequest = {
        disc_id: 'invalid'
      }
      return supertest(app)
        .post('/api/bags')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(invalidRequest)
        .expect(400, {
          error: { message: 'Invalid disc_id'}
        })
    })
    it('responds 400 "Disc does not exist" when given an invalid id', () => {
      const invalidRequest = {
        disc_id: 686
      }
      return supertest(app)
        .post('/api/bags')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(invalidRequest)
        .expect(400 , {
          error: { message: 'Disc does not exist' }
        })
    })
    it('responds 201 and new disc when given valid request', () => {
      const validRequest = {
        disc_id: 1
      }
      return supertest(app)
        .post('/api/bags')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(validRequest)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.user_id).to.eql(testUser.id)
          expect(res.body.name).to.eql(testDiscs[0].name)
          expect(res.body.brand).to.eql(testDiscs[0].brand)
          expect(res.body.speed).to.eql(testDiscs[0].speed)
          expect(res.body.glide).to.eql(testDiscs[0].glide)
          expect(res.body.turn).to.eql(testDiscs[0].turn)
          expect(res.body.fade).to.eql(testDiscs[0].fade)
        })
        .expect(res => 
          db
            .from('user_bag_discs')
            .select('*')
            .where({id: res.body.id})
            .first()
            .then(row => {
              expect(row.user_id).to.eql(testUser.id)
              expect(row.disc_id).to.eql(validRequest.disc_id)
            })  
        )
    })
  })
})