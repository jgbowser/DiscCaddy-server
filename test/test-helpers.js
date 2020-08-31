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

function makeTestFixtures() {
  const testUsers = makeUsersArray()
  const testDiscs = makeDiscsArray()
  return { testUsers, testDiscs }
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

module.exports = {
  makeTestFixtures,
  cleanTables,
  seedDiscs,
  seedUsers,
}