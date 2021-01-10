require("dotenv").config();
const knex = require("knex");
const configuration = require("../../knexfile");

const config =
  process.env.NODE_ENV === "production"
    ? configuration.production
    : configuration.development;

console.log("Model development >> ", process.env.NODE_ENV);

const connection = knex(config);

module.exports = connection;
