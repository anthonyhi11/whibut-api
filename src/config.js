module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://anthonyhill@localhost/whibut',
  TEST_DB_URL: process.env.TEST_DB_URL,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://whibut-client.now.sh/',
}