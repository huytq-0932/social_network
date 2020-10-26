exports.up = function (knex) {
    return knex.schema.createTable('comments', function (table) {
        table.increments();
        table.integer('user_id').notNullable().index().references('id').inTable('users')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');
        table.integer('post_id').notNullable().index().references('id').inTable('posts')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');
        table.text('content').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
};
exports.down = function (knex) {
    return knex.schema.dropTable('comments');
};
