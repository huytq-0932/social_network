exports.up = function(knex) {
    return knex.schema.createTable('chats', function (table) {
        table.increments();
        table.integer('send_id').notNullable().index().references('id').inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
        table.integer('receive_id').notNullable().index().references('id').inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
        table.text('content').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('chats');
};