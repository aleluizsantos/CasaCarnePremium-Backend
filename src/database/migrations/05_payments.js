exports.up = async function (knex) {
  return knex.schema.createTable("payment", (table) => {
    table.increments("id").primary();
    table.string("type").notNullable();
    table.boolean("active").notNullable().defaultTo(true);
    table.string("image").notNullable().defaultTo("default.jpg");
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("payment");
};
