exports.up = async function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("phone", 30).notNullable();
    table.string("password").notNullable();
    table.string("passwordResetToken").nullable();
    table.string("passwordResetExpires").nullable();
    table.string("typeUser").notNullable().defaultTo("user");
    table.boolean("blocked").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.string("tokenPushNotification").notNullable().unique();
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("users");
};
