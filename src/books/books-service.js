const BooksService = {
  getAllBooks(knex, userId) {
    return knex
      .select('*')
      .from('whibut_books')
      .where('user_id', userId) //returns only the books the user requested wrote...?.where('user_id', userId)
  },

  addBook(knex, newBook) {
    return knex
      .insert(newBook)
      .into('whibut_books')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, bookId, userId) {
    return knex
      .select('*')
      .from('whibut_books')
      .where('user_id', userId)
      .where('id', bookId)
      .first()
  },
  deleteBook(knex, id) {
    return knex('whibut_books')
      .where({ id })
      .delete();
  }
}

module.exports = BooksService;
