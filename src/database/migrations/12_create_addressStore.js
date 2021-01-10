exports.up = async function (knex) {
  return knex.schema.createTable("addressStore", (table) => {
    table.increments("id").primary;
    table.string("cep").notNullable();
    table.string("address").notNullable();
    table.string("number").notNullable();
    table.string("neighborhood").notNullable();
    table.string("city").notNullable();
    table.string("uf", 2).notNullable();
    table.string("phone", 30).nullable();
    table.string("latitude").notNullable();
    table.string("longitude").notNullable();
    table.boolean("active").notNullable();
  });
};
exports.down = async function (knex) {
  return knex.schema.dropTable("addressStore");
};
