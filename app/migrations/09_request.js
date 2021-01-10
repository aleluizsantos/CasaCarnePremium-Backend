exports.up = async function (knex) {
  return knex.schema.createTable("request", (table) => {
    table.increments("id").primary();
    table.timestamp("dateTime").defaultTo(knex.fn.now());
    table.decimal("totalPurchase", 6, 2).notNullable();
    table.string("coupon").nullable();
    table.decimal("discount", 6, 2).nullable();
    table.string("note").nullable();

    table.string("address").notNullable();
    table.string("number", 6).notNullable();
    table.string("neighborhood").notNullable();
    table.string("city").notNullable();
    table.string("uf", 2).notNullable();
    table.string("PointReferences").nullable();
    table.datetime("scheduleDateTime").nullable();

    table.integer("user_id").notNullable();
    table.foreign("user_id").references("id").inTable("users");

    table.integer("deliveryType_id").notNullable();
    table.foreign("deliveryType_id").references("id").inTable("deliveryType");

    table.integer("statusRequest_id").notNullable();
    table.foreign("statusRequest_id").references("id").inTable("statusRequest");

    table.integer("payment_id").notNullable();
    table.foreign("payment_id").references("id").inTable("payment");
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("request");
};