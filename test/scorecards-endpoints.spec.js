const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Scorecards Endpoints', () => {
  let db

  const{ testUsers, testScorecards } = helpers.makeTestFixtures()
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

  describe('GET /api/scorecards', () => {
    context('Given no data', () => {
      beforeEach('seed users', () => helpers.seedUsers(db, testUsers))

      it('responds 200 and empty array', () => {
        return supertest(app)
          .get('/api/scorecards')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, [])
      })
    })
    context('Given data', () => {
      beforeEach('seed users and scorecards', () => 
        helpers.seedScorecards(db, testUsers, testScorecards)
      )
      it('responds 200 and list of user\'s scorecards', () => {
        const expectedScorecards = helpers.makeExpectedScorecards(testScorecards, testUser.id)
        return supertest(app)
          .get('/api/scorecards')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedScorecards)
      })
    })
  })
  describe('POST /api/scorecards', () => {
    beforeEach('seed users', () => 
      helpers.seedUsers(db, testUsers)
    )
    it('successfully posts given an incomplete scorecard', function() {
      this.retries(3)
      const incompleteCard = { 
        hole_1: 3,
        hole_2: 3,
        hole_3: 4,
        hole_4: 2,
        hole_5: 2,
        hole_6: 3,
        hole_7: 3,
        hole_8: 3,
        hole_9: 3,
        hole_10: 3,
        hole_11: 2,
        hole_12: 4,
        hole_13: 4,
        hole_14: 3,
        hole_15: 3,
        hole_16: 3,
        hole_17: 3
      }
      return supertest(app)
        .post('/api/scorecards')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(incompleteCard)
        .expect(201)
        .expect(res =>{
          expect(res.body).to.have.property('id')
          expect(res.body.user_id).to.eql(testUser.id)
          expect(res.body.hole_18).to.be.a('number').and.to.eql(0)
          const expectedDate = new Date().toLocaleString()
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        }
        )
        .expect(res => 
          db
            .from('scorecards')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.user_id).to.eql(testUser.id)
              expect(row.hole_1).to.eql(incompleteCard.hole_1)
              expect(row.hole_2).to.eql(incompleteCard.hole_2)
              expect(row.hole_3).to.eql(incompleteCard.hole_3)
              expect(row.hole_4).to.eql(incompleteCard.hole_4)
              expect(row.hole_5).to.eql(incompleteCard.hole_5)
              expect(row.hole_6).to.eql(incompleteCard.hole_6)
              expect(row.hole_7).to.eql(incompleteCard.hole_7)
              expect(row.hole_8).to.eql(incompleteCard.hole_8)
              expect(row.hole_9).to.eql(incompleteCard.hole_9)
              expect(row.hole_10).to.eql(incompleteCard.hole_10)
              expect(row.hole_11).to.eql(incompleteCard.hole_11)
              expect(row.hole_12).to.eql(incompleteCard.hole_12)
              expect(row.hole_13).to.eql(incompleteCard.hole_13)
              expect(row.hole_14).to.eql(incompleteCard.hole_14)
              expect(row.hole_15).to.eql(incompleteCard.hole_15)
              expect(row.hole_16).to.eql(incompleteCard.hole_16)
              expect(row.hole_17).to.eql(incompleteCard.hole_17)
              expect(row).to.have.property('hole_18')
              expect(row.hole_18).to.eql(0)
              const expectedDate = new Date().toLocaleString()
              expect(new Date(row.date_created).toLocaleString()).to.eql(expectedDate)  
            })  
        )
    })
    it('successfully posts given a complete scorecard', function() {
      this.retries(3)
      const completeCard = { 
        hole_1: 3,
        hole_2: 3,
        hole_3: 4,
        hole_4: 2,
        hole_5: 2,
        hole_6: 3,
        hole_7: 3,
        hole_8: 3,
        hole_9: 3,
        hole_10: 3,
        hole_11: 2,
        hole_12: 4,
        hole_13: 4,
        hole_14: 3,
        hole_15: 3,
        hole_16: 3,
        hole_17: 3,
        hole_18: 2
      }
      return supertest(app)
        .post('/api/scorecards')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(completeCard)
        .expect(201)
        .expect(res =>{
          expect(res.body).to.have.property('id')
          expect(res.body.user_id).to.eql(testUser.id)
          const expectedDate = new Date().toLocaleString()
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        }
        )
        .expect(res => 
          db
            .from('scorecards')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.user_id).to.eql(testUser.id)
              expect(row.hole_1).to.eql(completeCard.hole_1)
              expect(row.hole_2).to.eql(completeCard.hole_2)
              expect(row.hole_3).to.eql(completeCard.hole_3)
              expect(row.hole_4).to.eql(completeCard.hole_4)
              expect(row.hole_5).to.eql(completeCard.hole_5)
              expect(row.hole_6).to.eql(completeCard.hole_6)
              expect(row.hole_7).to.eql(completeCard.hole_7)
              expect(row.hole_8).to.eql(completeCard.hole_8)
              expect(row.hole_9).to.eql(completeCard.hole_9)
              expect(row.hole_10).to.eql(completeCard.hole_10)
              expect(row.hole_11).to.eql(completeCard.hole_11)
              expect(row.hole_12).to.eql(completeCard.hole_12)
              expect(row.hole_13).to.eql(completeCard.hole_13)
              expect(row.hole_14).to.eql(completeCard.hole_14)
              expect(row.hole_15).to.eql(completeCard.hole_15)
              expect(row.hole_16).to.eql(completeCard.hole_16)
              expect(row.hole_17).to.eql(completeCard.hole_17)
              expect(row.hole_18).to.eql(completeCard.hole_18)
              const expectedDate = new Date().toLocaleString()
              expect(new Date(row.date_created).toLocaleString()).to.eql(expectedDate)  
            })  
        )
    })
  })
})