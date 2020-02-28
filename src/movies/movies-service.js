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
    }
}

module.exports = MoviesService;
