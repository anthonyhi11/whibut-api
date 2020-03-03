module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://anthonyhill@localhost/whibut',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://whibut-client.now.sh/',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this'
}