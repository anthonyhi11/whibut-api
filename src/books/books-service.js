const BooksService = {
  getAllBooks(knex, userId) {
    return knex
      .select('*')
      .from('whibut_books')
      .where('user_id', userId) //returns only the books the user requested wrote...?.where('user_id', userId)
  }
}

module.exports = BooksService;
