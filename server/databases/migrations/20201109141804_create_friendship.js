exports.up = function (knex) {
    return knex.schema.createTable("friendship", function (table) {
        table.increments()
        table.integer("user_one_id").notNullable();
        table.integer("user_two_id").notNullable();
        table.integer("status").nullable();
        table.integer("action_user_id").nullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("friendship")
};
