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
  }
}


module.exports = AdminService