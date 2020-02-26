const RestaurantsService = {
  getAllRestaurants(knex, userId) {
    return knex
      .select('*')
      .from('whibut_restaurants')
      .where('user_id', userId) //returns only the books the user requested wrote...?.where('user_id', userId)
  }
}

module.exports = RestaurantsService;
