const ScorecardsService = {
  getAllScorecards(db, user_id) {
    return db('scorecards')
      .select('*')
      .where({ user_id })
  },

  insertScorecard(db, newScorecard) {
    return db('scorecards')
      .insert(newScorecard)
      .returning('*')
      .then(([scorecard]) => scorecard)
  },

  serializeScorecard(card) {
    return {
      id: card.id,
      user_id: card.user_id,
      date_created: new Date(card.date_created),
      hole_1: Number(card.hole_1),
      hole_2: Number(card.hole_2),
      hole_3: Number(card.hole_3),
      hole_4: Number(card.hole_4),
      hole_5: Number(card.hole_5),
      hole_6: Number(card.hole_6),
      hole_7: Number(card.hole_7),
      hole_8: Number(card.hole_8),
      hole_9: Number(card.hole_9),
      hole_10: Number(card.hole_10),
      hole_11: Number(card.hole_11),
      hole_12: Number(card.hole_12),
      hole_13: Number(card.hole_13),
      hole_14: Number(card.hole_14),
      hole_15: Number(card.hole_15),
      hole_16: Number(card.hole_16),
      hole_17: Number(card.hole_17),
      hole_18: Number(card.hole_18),
    }
  },
}

module.exports = ScorecardsService