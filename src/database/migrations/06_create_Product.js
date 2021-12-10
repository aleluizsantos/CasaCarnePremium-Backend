exports.up = async function (knex) {
  return knex.schema.createTable("product", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("description").nullable();
    table.text("ingredient").nullable();
    table.decimal("price", 6, 2).notNullable();
    table.string("image");
    table.boolean("promotion").defaultTo(false);
    table.string("additional").nullable();
    table.decimal("pricePromotion", 6, 2).defaultTo(0);
    table.string("valueDefautAdditional", 100);

    table.boolean("visibleApp").defaultTo(true);

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
