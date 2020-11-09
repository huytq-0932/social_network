exports.up = function (knex) {
    return knex.schema.createTable("friends", function (table) {
        table.increments();
        table.integer("user_1_id").notNullable();
        table.integer("user_2_id").notNullable();
        table.string("status").nullable();
        table.string("action_user_id").nullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("friend_requests");
};
