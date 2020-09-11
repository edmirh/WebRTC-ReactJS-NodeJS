exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments();
        table.text('name').notNullable();
        table.text('email').unique().notNullable();
        table.text('password').notNullable();
        table.text('phone').unique().notNullable();
        table.datetime('date').notNullable();
        table.boolean('is_active').notNullable().defaultTo(true);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
}