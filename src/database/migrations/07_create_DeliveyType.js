exports.up = async function (knex) {
  return knex.schema.createTable("deliveryType", (table) => {
    table.increments("id").primary();
    table.string("description").notNullable();
    table.boolean("hasTaxa").defaultTo(false);
    table.string("averageTime", 100);
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("deliveryType");
};
