const TvService = {
  getAllTv(knex, userId) {
    return knex
      .select('*')
      .from('whibut_tv')
      .where('user_id', userId) //returns only the books the user requested wrote...?.where('user_id', userId)
  },
  addTv(knex, newTv) {
    return knex
      .insert(newTv)
      .into('whibut_tv')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, tvId, userId) {
    return knex
      .select('*')
      .from('whibut_tv')
      .where('user_id', userId)
      .where('id', tvId)
      .first()
  },
  deleteTv(knex, id) {
    return knex('whibut_tv')
      .where({ id })
      .delete();
  }
}

module.exports = TvService;
