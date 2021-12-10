exports.up = async function (knex) {
  return knex.schema.createTable("entryProductStock", (table) => {
    table.increments("id").primary;
    table.datetime("data_entry").notNullable();
    table.decimal("amount", 6, 2).notNullable();
    table.decimal("price", 6, 2).notNullable();

    table.integer("provider_id").notNullable();
    table
      .foreign("provider_id")
      .references("id")
      .inTable("provider")
      .onDelete("CASCADE");

    table.integer("product_id").notNullable();
    table
      .foreign("product_id")
      .references("id")
      .inTable("product")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("entryProductStock");
};
