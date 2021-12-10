exports.up = async function (knex) {
  return knex.schema.createTable("openingHours", (table) => {
    table.increments("id").primary();
    table.string("week").notNullable().unique();
    table.integer("week_id").notNullable();
    table.string("start").notNullable();
    table.string("end").notNullable();
    table.boolean("open").defaultTo(false);
  });
};
exports.down = async function (knex) {
  return knex.schema.dropTable("openingHours");
};
