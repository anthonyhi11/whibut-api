# WHIBUT v1.1 - WHAT HAVE I BEEN UP TO?

This is the API for the WHIBUT-CLIENT. 
Live Client: whibut-client.now.sh.
CLIENT REPO: https://github.com/anthonyhi11/whibut-client

## GETTING STARTED

### INSTALLING
`npm install`

### Create database and test database

### Run migrations

`npm run migrate`

### Running the tests
`npm run test`


## ENDPOINTS

### /api/books 
- POST -- creates a new book and inserts into table
- GET -- gets books associated with user
- DELETE -- Deletes book record from table

### /api/movies
- POST -- creates a new movie and inserts into table
- GET -- gets movies associated with user
- DELETE -- Deletes movie record from table

### /api/tv
- POST -- creates a new tv show and inserts into table
- GET -- gets tv shows associated with user
- DELETE -- Deletes tv record from table

### /api/restaurants
- POST -- creates a new restaurant and inserts into table
- GET -- gets restaurants associated with user
- DELETE -- Deletes restaurant record from table

### /api/users
- POST -- creates a new user

##### /settings
- PATCH -- updates the user info

### /api/login
- POST -- Logs the user in

## TECH USED

Built using Node, Express, PostgreSQL, JWT, Mocha, Chai, knex, 

## ROADMAP

### v1.2

1. EDIT posts
2. Miscellaneous category

### v1.3

1. Search ability from home screen
2. Filtering posts

