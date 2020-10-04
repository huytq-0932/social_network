
exports.up = function(knex) {
    return knex.schema.createTable('admins', function (table) {
        table.increments();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.integer('groupId').nullable();
        table.integer('status').nullable();
        table.integer('isRoot').nullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.integer('updatedBy').nullable().index().references('id').inTable('admins')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('admins');
};
