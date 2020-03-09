require('dotenv').config()

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DEV_DB_HOST,
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASS,
      database: process.env.DEV_DB_NAME,
    },
    migrations: {
      directory: './build/data/migrations',
    },
    seeds: {
      directory: './build/data/seeds',
    },
  },

  test: {
    client: 'pg',
    connection: {
      host: process.env.TEST_DB_HOST,
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASS,
      database: process.env.TEST_DB_NAME,
    },
    migrations: {
      directory: './build/data/migrations',
    },
    seeds: {
      directory: './build/data/seeds',
    },
  },

  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './build/data/migrations',
    },
    seeds: {
      directory: './build/data/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './build/data/migrations',
    },
    seeds: {
      directory: './build/data/seeds',
    },
  },
}
