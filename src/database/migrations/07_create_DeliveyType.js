exports.up = async function(knex) {
    return knex.schema.createTable('deliveryType', (table)=> {
           table.increments('id').primary();
           table.string("description").notNullable();
    });
}

exports.down = async function(knex) {
    return knex.schema.dropTable('deliveryType');
}