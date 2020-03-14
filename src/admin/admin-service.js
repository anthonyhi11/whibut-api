const AdminService = {
  getAllUsers(knex) {
    return knex
      .select('*')
      .from('whibut_users')
     //returns all users 
  },

  getAllMovies(knex) {
    return knex
      .select('*')
      .from('whibut_movies')
  },

  getAllBooks(knex) {
    return knex
      .select('*')
      .from('whibut_books')
  },

  getAllTv(knex) {
    return knex
      .select('*')
      .from('whibut_tv')
  },

  getAllRest(knex) {
    return knex
      .select('*')
      .from('whibut_restaurants')
  }
}


module.exports = AdminService