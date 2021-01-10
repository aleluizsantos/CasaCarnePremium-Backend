require("dotenv").config();

const knex = require("knex");
const configuration = require("../../knexfile");

console.log("Config BD ==> ", process.env.NODE_ENV);

const config =
  process.env.NODE_ENV == "test"
    ? configuration.test
    : configuration.development;

console.log("Description config ==> ", config);
const connection = knex(config);

module.exports = connection;
