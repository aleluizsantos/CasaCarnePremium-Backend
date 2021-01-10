exports.up = async function (knex) {
    return knex.schema.createTable('itemsRequets', (table) => {
        table.increments('id').primary();
        table.decimal('amount', 6, 2).notNullable();
        table.decimal('price', 6, 2).notNullable();

        table.integer('product_id').notNullable();
        table.foreign('product_id').references('id').inTable('product');

        table.integer('request_id').notNullable();
        table.foreign('request_id').references('id').inTable('request');
    });
}

exports.down = async function (knex) {
    return knex.schema.dropTable('itemsRequets');
}