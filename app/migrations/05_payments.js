exports.up = async function (knex) {
    return knex.schema.createTable('payment', (table) => {
        table.increments('id').primary();
        table.string("type").notNullable();
        table.boolean("active").notNullable().defaultTo(true);
    });
}

exports.down = async function (knex) {
    return knex.schema.dropTable('payment');
}