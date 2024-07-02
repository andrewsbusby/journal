/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.scheme.createTable('entries', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.string('text').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('entries');
};
