const DiscsService = {
  
  getAllDiscs(db) {
    return db('discs')
      .select('*')
  },

  serializeDisc(disc) {
    return {
      id: disc.id,
      name: disc.name,
      brand: disc.brand,
      speed: Number(disc.speed),
      glide: Number(disc.glide),
      turn: Number(disc.turn),
      fade: Number(disc.fade)
    }
  },
}

module.exports = DiscsService