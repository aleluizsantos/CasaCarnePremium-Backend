exports.up = async function (knex) {
  return knex.schema.createTable("taxaDelivery", (table) => {
    table.increments("id").primary;
    table.decimal("vMinTaxa", 6, 2).notNullable();
    table.decimal("taxa", 6, 2).notNullable();
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("taxaDelivery");
};
