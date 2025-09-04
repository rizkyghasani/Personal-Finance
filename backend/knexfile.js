// knexfile.js
require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations' // Pastikan ini mengarah ke folder yang baru dibuat
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  }
};