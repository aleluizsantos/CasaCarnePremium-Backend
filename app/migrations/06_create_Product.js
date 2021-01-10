exports.up = async function (knex) {
  return knex.schema.createTable("product", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("description").notNullable();
    table.decimal("price", 6, 2).notNullable();
    table.string("image");
    table.boolean("promotion").defaultTo(false);
    table.decimal("pricePromotion", 6, 2).defaultTo(0);

    table.integer("category_id").notNullable();
    table
      .foreign("category_id")
      .references("id")
      .inTable("category")
      .onDelete("CASCADE");

    table.integer("measureUnid_id").notNullable();
    table
      .foreign("measureUnid_id")
      .references("id")
      .inTable("measureUnid")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("product");
};
