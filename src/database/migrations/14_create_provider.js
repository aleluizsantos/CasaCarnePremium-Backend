exports.up = async function (knex) {
  return knex.schema.createTable("provider", (table) => {
    table.increments("id").primary();
    table.string("nameProvider").notNullable();
    table.string("nameContact").notNullable();
    table.string("address").notNullable();
    table.string("cep").nullable();
    table.string("number").notNullable();
    table.string("neighborhood").notNullable();
    table.string("city").notNullable();
    table.string("uf", 2).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("provider");
};
