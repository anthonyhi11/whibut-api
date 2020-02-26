const MoviesService = {
  getAllMovies(knex, userId) {
    return knex
      .select('*')
      .from('whibut_movies')
      .where('user_id', userId) //returns only the books the user requested wrote...?.where('user_id', userId)
  }
}

module.exports = MoviesService;
