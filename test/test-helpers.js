/* eslint-disable quotes */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeUsersArray() {
  return [
    {
      id: 1,
      first_name: 'first',
      last_name: 'user',
      username: 'test_user_1',
      email: 'testuser1@test.com',
      password: 'password',
      date_created: '2020-08-29T14:48:27.330Z'
    },
    {
      id: 2,
      first_name: 'second',
      last_name: 'user',
      username: 'test_user_2',
      email: 'testuser2@test.com',
      password: 'password',
      date_created: '2020-08-30T14:48:27.330Z'
    },
    {
      id: 3,
      first_name: 'third',
      last_name: 'user',
      username: 'test_user_3',
      email: 'testuser3@test.com',
      password: 'password',
      date_created: '2020-08-31T14:48:27.330Z'
    }
  ]
}

function makeDiscsArray() {
  return [
    {
      id: 1,
      name: 'test-disc-1',
      brand: 'discs_inc',
      speed: 12,
      glide: 3,
      turn: -1,
      fade: 3
    },
    {
      id: 2,
      name: 'test-disc-2',
      brand: 'discs_inc',
      speed: 10,
      glide: 4,
      turn: -2,
      fade: 2
    },
    {
      id: 3,
      name: 'test-disc-3',
      brand: 'frisbee_co',
      speed: 7,
      glide: 5,
      turn: -4,
      fade: 2
    },
    {
      id: 4,
      name: 'test-disc-4',
      brand: 'discs_inc',
      speed: 14,
      glide: 3,
      turn: 1.5,
      fade: 5
    },
    {
      id: 5,
      name: 'test-disc-5',
      brand: 'frisbee_co',
      speed: 3,
      glide: 4,
      turn: -0.5,
      fade: 1
    },
  ]
}

function makeBaggedDiscsArray(users, discs) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      disc_id: discs[0].id
    },
    {
      id: 2,
      user_id: users[0].id,
      disc_id: discs[1].id
    },
    {
      id: 3,
      user_id: users[1].id,
      disc_id: discs[0].id
    },
    {
      id: 4,
      user_id: users[2].id,
      disc_id: discs[2].id
    },
    {
      id: 5,
      user_id: users[2].id,
      disc_id: discs[3].id
    },
    {
      id: 6,
      user_id: users[1].id,
      disc_id: discs[4].id
    },
    {
      id: 7,
      user_id: users[1].id,
      disc_id: discs[2].id
    },
    {
      id: 8,
      user_id: users[0].id,
      disc_id: discs[2].id
    },
    {
      id: 9,
      user_id: users[0].id,
      disc_id: discs[3].id
    },
    {
      id: 10,
      user_id: users[0].id,
      disc_id: discs[4].id
    },
  ]
}

function makeScorecardsArray(users) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      date_created: '2020-09-02T16:17:34.442Z', 
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
      hole_18: 5
    },
    {
      id: 2,
      user_id: users[1].id,
      date_created: '2020-09-02T16:17:34.442Z', 
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
      hole_18: 5
    },
    {
      id: 3,
      user_id: users[2].id,
      date_created: '2020-09-02T16:17:34.442Z', 
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
      hole_18: 5
    },
    {
      id: 4,
      user_id: users[0].id,
      date_created: '2020-08-29T16:17:34.442Z', 
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
      hole_18: 5
    },
    {
      id: 5,
      user_id: users[1].id,
      date_created: '2020-09-02T16:17:34.442Z', 
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
      hole_18: 5
    },
  ]
}

function makeTestFixtures() {
  const testUsers = makeUsersArray()
  const testDiscs = makeDiscsArray()
  const testBagDiscs = makeBaggedDiscsArray(testUsers, testDiscs)
  const testScorecards = makeScorecardsArray(testUsers)
  return { testUsers, testDiscs, testBagDiscs, testScorecards }
}

function makeExpectedUserBag(baggedDiscs, discs, user_id) {
  const userDiscs = baggedDiscs.filter(disc => disc.user_id === user_id)
  const joinedList = userDiscs.map(disc => (
    {
      id: disc.id,
      user_id: disc.user_id,
      name: discs[disc.disc_id - 1].name,
      brand: discs[disc.disc_id - 1].brand,
      speed: discs[disc.disc_id - 1].speed,
      glide: discs[disc.disc_id - 1].glide,
      turn: discs[disc.disc_id - 1].turn,
      fade: discs[disc.disc_id - 1].fade,
    }
  )
  )
  return joinedList
}

function makeExpectedScorecards(scorecards, user_id) {
  return scorecards.filter(card => card.user_id === user_id)
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db('users').insert(preppedUsers)
    .then(() => db.raw(`SELECT setval('users_id_seq', ?)`,
      [users[users.length-1].id]
    )
    )
}

function seedDiscs(db, discs) {
  return db('discs').insert(discs)
    .then(() => db.raw(`SELECT setval('discs_id_seq', ?)`,
      [discs[discs.length - 1].id]
    )
    )
}

function seedBagDiscs(db, discs, users, bagDiscs) {
  return db.transaction(async trx => {
    await seedDiscs(trx, discs)
    await seedUsers(trx, users)
    await trx.into('user_bag_discs').insert(bagDiscs)
    await trx.raw(`
      SELECT setval('user_bag_discs_id_seq', ?)`,
    [bagDiscs[bagDiscs.length -1].id]
    )
  })
}

function seedScorecards(db, users, scorecards) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('scorecards').insert(scorecards)
    await trx.raw(
      `SELECT setval('scorecards_id_seq', ?)`,
      [scorecards[scorecards.length - 1].id]
    )
  })
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
    discs,
    users,
    user_bag_discs,
    scorecards
    RESTART IDENTITY CASCADE`
  )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeTestFixtures,
  cleanTables,
  makeAuthHeader,
  makeExpectedUserBag,
  makeExpectedScorecards,
  seedDiscs,
  seedUsers,
  seedBagDiscs,
  seedScorecards
}