const AdminService = {
  getAllUsers(knex) {
    return knex
      .select('*')
      .from('whibut_users')
     //returns all users 
  },
}

module.exports = AdminService