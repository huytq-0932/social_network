
exports.up = function(knex) {
    return knex.schema.createTable('admin_group_permissions', function (table) {
        table.increments();
        table.integer('groupId').notNullable().index().references('id').inTable('admin_groups')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer('permissionId').nullable().index().references('id').inTable('admin_permissions')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.integer('createdBy').nullable().index().references('id').inTable('admins')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('admin_group_permissions');
};
