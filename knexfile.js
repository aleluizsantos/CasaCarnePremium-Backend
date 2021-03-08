require("dotenv").config();
const path = require("path");

module.exports = {
  development: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "seeds"),
    },
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
      tableName: "knex_migrations",
    },
    seeds: {
      directory: path.resolve(__dirname, "src", "database", "seeds"),
    },
  },
};
