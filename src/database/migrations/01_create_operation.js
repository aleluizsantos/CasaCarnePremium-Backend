exports.up = async function(knex) {
    return knex.schema.createTable("operation", (table)=> {
           table.increments("id") .primary;
           table.boolean('open_close').defaultTo(false);
    });
}

exports.down = async function(knex) {
    return knex.schema.dropTable("operation");
}