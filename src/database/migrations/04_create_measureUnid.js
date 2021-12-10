exports.up = async function (knex) {
  return knex.schema.createTable("measureUnid", (table) => {
    table.increments("id").primary();
    table.string("unid").notNullable();
    table.string("description").notNullable();
    table.string("valueIncrement").nullable();
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("measureUnid");
};
