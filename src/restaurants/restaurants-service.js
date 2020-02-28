const RestaurantsService = {
  getAllRestaurants(knex, userId) {
    return knex
      .select('*')
      .from('whibut_restaurants')
      .where('user_id', userId) //returns only the books the user requested wrote...?.where('user_id', userId)
  },
  addRestaurant(knex, newRestaurant) {
    return knex
      .insert(newRestaurant)
      .into('whibut_restaurants')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, restId, userId) {
    return knex
      .select('*')
      .from('whibut_restaurants')
      .where('user_id', userId)
      .where('id', restId)
      .first()
  },
  deleteRest(knex, id) {
    return knex('whibut_restaurants')
      .where({ id })
      .delete();
  }
}

module.exports = RestaurantsService;
