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

function makeTestFixtures() {
  const testUsers = makeUsersArray()
  return { testUsers }
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

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
    users,
    user_bag_discs,
    scorecards
    RESTART IDENTITY CASCADE`
  )
}

module.exports = {
  makeTestFixtures,
  cleanTables,
  seedUsers,
}