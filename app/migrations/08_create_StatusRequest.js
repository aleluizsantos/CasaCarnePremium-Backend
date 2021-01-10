exports.up = async function(knex) {
    return knex.schema.createTable('statusRequest', (table)=> {
           table.increments('id').primary();
           table.string("description").notNullable();
           table.string('BGcolor').notNullable();
    });
}

exports.down = async function(knex) {
    return knex.schema.dropTable('statusRequest');
}