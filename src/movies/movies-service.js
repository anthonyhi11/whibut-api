const MoviesService = {
  getAllMovies(knex, userId) {
    return knex
      .select('*')
      .from('whibut_movies')
      .where('user_id', userId) //returns only the books the user requested wrote...?.where('user_id', userId)
  },
  addMovie(knex, newMovie) {
    return knex
      .insert(newMovie)
      .into('whibut_movies')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
    },
    getById(knex, movieId, userId) {
      return knex
        .select('*')
        .from('whibut_movies')
        .where('user_id', userId)
        .where('id', movieId)
        .first();
    },
    deleteMovie(knex, id) {
      return knex('whibut_movies')
        .where({ id })
        .delete();
    }
}

module.exports = MoviesService;
