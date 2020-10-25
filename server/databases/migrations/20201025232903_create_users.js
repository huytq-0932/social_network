exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('password').notNullable();
        table.string('phone').nullable();
        table.string('avatar').nullable();
        table.jsonb('blocked_user_ids').nullable().defaultTo('[]');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};