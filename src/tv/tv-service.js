const TvService = {
  getAllTv(knex, userId) {
    return knex
      .select('*')
      .from('whibut_tv')
      .where('user_id', userId) //returns only the books the user requested wrote...?.where('user_id', userId)
  }
}

module.exports = TvService;
