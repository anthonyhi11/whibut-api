BEGIN;

TRUNCATE
  whibut_users,
  whibut_movies,
  whibut_books,
  whibut_restaurants,
  whibut_tv
  RESTART IDENTITY CASCADE;

  INSERT INTO whibut_users (username, password) 
    VALUES
      ('anthonyhill', '$2b$10$U/LnH9uknjCST5M81BgYZOq5.ukvTN6TtrOnkPwNRIEO2QK7XrQsO'),
      ('anthonyhill2', '$2a$12$CRTGcNoU2UEuam7GnBq8nOj9pPPaFSPY/j8MwjWSrS74D8g7e6d3S');

  INSERT INTO whibut_books (user_id, activity, title, author, genre, rating, comments)
    VALUES
      (1, 'books', 'Call of the Wild', 'Jack London', 'Adventure', 8, 'Read this when I was younger. Really enjoyed the rugged setting of the wild west in a time where bad men could get away and a dog could win'),
      (2, 'books', 'Beyond the Sea of Ice', 'William Sarabande', 'Historical Fiction', 7, 'Ive been looking for a historical fiction set in prehistoric times when men had yet to find America. This book follows Torka, a young hunter and his band as they weather the long, brutal winters and murderous bands they encounter on their search for better hunting grounds and survival');

  INSERT INTO whibut_movies (user_id, activity, title, genre, rating, comments)
    VALUES 
      (1, 'movies', 'Parasite', 'Thriller', 10, 'Wonderful film. Had us questioning the disparity between classes. Subtitled and so suspenseful'),
      (1, 'movies', 'Ad Astra', 'Sci-Fi', 6, 'Started out with an interesting world in the future with an A-List leading man. The movie fizzled with bad character writing');


  INSERT INTO whibut_tv (user_id, activity, title, network, genre, rating, comments)
    VALUES 
      (1, 'tv', 'The Outsider', 'HBO', 'Horror', 8, 'Stephen King keeps trying to keep me scared. A mix of crime and supernatural keeps you on your feet and checking your locks before bed.'),
      (1, 'tv', 'The Bachelor', 'ABC', 'Reality', 5, 'Only worth watching for a few episodes as the show drags on and barely kept afloat by the meddlesome producers');

  
  INSERT INTO whibut_restaurants (user_id, activity, restaurant_name, restaurant_type, website, rating, comments) 
    VALUES 
      (1, 'restaurants', 'Popeyes', 'Fast Food', 'N/A', 7, 'Can be a bit pricey, but definitely one of the better options when it comes to fast chicken');

      COMMIT;