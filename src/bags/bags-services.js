const BagsServices = {
  getUserDiscs(db, user_id) {
    return db
      .from('user_bag_discs')
      .select('*')
      .where({ user_id })
  },

  findUser(db, id) {
    return db
      .from('users')
      .where({ id })
      .first()
  },
}

module.exports = BagsServices