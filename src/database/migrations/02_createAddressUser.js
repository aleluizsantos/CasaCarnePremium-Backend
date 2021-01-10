exports.up = async function (knex) {
  return knex.schema.createTable("addressUser", (table) => {
    table.increments("id").primary;
    table.string("address").notNullable();
    table.string("cep").nullable();
    table.string("number").notNullable();
    table.string("neighborhood").notNullable();
    table.string("city").notNullable();
    table.string("uf", 2).notNullable();
    table.boolean("active").notNullable();
    table.string("pointReference").nullable();

    table.integer("user_id").notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    //table.integer('user_id').references('id').inTable('users').notNullable().onDelete('cascade');
  });
};
exports.down = async function (knex) {
  return knex.schema.dropTable("addressUser");
};
