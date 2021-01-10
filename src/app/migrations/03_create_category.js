exports.up = async function (knex) {
  return knex.schema.createTable("category", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("image").defaultTo("default.png");
  });
};
exports.down = async function (knex) {
  return knex.schema.dropTable("category");
};
