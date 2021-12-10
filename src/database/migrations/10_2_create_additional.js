exports.up = async function (knex) {
  return knex.schema.createTable("additional", (table) => {
    table.increments("id").primary();
    table.string("description").notNullable();
    table.decimal("price", 6, 2).notNullable();

    table.integer("typeAdditional_id").notNullable();
    table
      .foreign("typeAdditional_id")
      .references("id")
      .inTable("typeAdditional")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("additional");
};
