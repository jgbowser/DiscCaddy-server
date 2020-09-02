const express = require('express')
const path = require('path')
const ScorecardsService = require('./scorecards-service')
const { requireAuth } = require('../middleware/jwt-auth')

const scorecardsRouter = express.Router()
const jsonBodyParser = express.json()

scorecardsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const user_id = req.user.id
    ScorecardsService.getAllScorecards(req.app.get('db'), user_id)
      .then(scorecards => {
        const serializedScorecards = scorecards.map(scorecard => 
          ScorecardsService.serializeScorecard(scorecard)
        )
        res.status(200).json(serializedScorecards)
      })
  })
  .post(jsonBodyParser, (req, res, next) => {
    const user_id = req.user.id

    //incomplete rounds need to send only holes that have scores (eg. user played nine holes: req should only have hole_1 - hole_9)

    const newScorecard = {
      hole_1: req.body.hole_1,
      hole_2: req.body.hole_2,
      hole_3: req.body.hole_3,
      hole_4: req.body.hole_4,
      hole_5: req.body.hole_5,
      hole_6: req.body.hole_6,
      hole_7: req.body.hole_7,
      hole_8: req.body.hole_8,
      hole_9: req.body.hole_9,
      hole_10: req.body.hole_10,
      hole_11: req.body.hole_11,
      hole_12: req.body.hole_12,
      hole_13: req.body.hole_13,
      hole_14: req.body.hole_14,
      hole_15: req.body.hole_15,
      hole_16: req.body.hole_16,
      hole_17: req.body.hole_17,
      hole_18: req.body.hole_18,
    }

    newScorecard.user_id = user_id

    ScorecardsService.insertScorecard(req.app.get('db'), newScorecard)
      .then(scorecard => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${scorecard.id}`))
          .json(ScorecardsService.serializeScorecard(scorecard))
      })
  })

module.exports = scorecardsRouter