exports.up = async function (knex) {
    return knex.schema.createTable('coupon', (table) => {
        table.increments('id').primary();
        table.string("number", 20).notNullable();
        table.string("paymentType").nullable();
        table.integer("amount").notNullable().defaultTo(1);
        table.datetime('dataExpireCoupon').defaultTo(knex.fn.now());
        table.decimal("discountAmount").notNullable().defaultTo(1);
    });
}

exports.down = async function (knex) {
    return knex.schema.dropTable('coupon');
}