const BagsServices = {
  getUserDiscs(db, user_id) {
    return db
      .from('user_bag_discs')
      .select(
        'user_bag_discs.id',
        'user_bag_discs.user_id',
        'discs.name',
        'discs.brand',
        'discs.speed',
        'discs.glide',
        'discs.turn',
        'discs.fade')
      .where({ user_id })
      .join('discs', 'user_bag_discs.disc_id', 'discs.id')
  },

  getById(db, disc_id) {
    return db
  }

  serializeBagDisc(disc) {
    return {
      id: disc.id,
      user_id: disc.user_id,
      name: disc.name,
      brand: disc.brand,
      speed: Number(disc.speed),
      glide: Number(disc.glide),
      turn: Number(disc.turn),
      fade: Number(disc.fade)
    }
  },

  insertBagDisc(db, newDisc) {
    return db
      .insert(newDisc)
      .into('user_bag_discs')
      .returning('*')
      .then(([disc]) => disc)
      .then(disc => BagsServices.get)
      
  }
}

module.exports = BagsServices