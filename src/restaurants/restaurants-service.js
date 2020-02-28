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
}

module.exports = RestaurantsService;
