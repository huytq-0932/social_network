
exports.up = function(knex) {
    // return knex.schema.createTable("friend_requests", function (table) {
    //     table.increments();
    //     table.integer("from_user_id").notNullable();
    //     table.integer("to_user_id").notNullable();
    //     table.string("status").nullable();
    //     table.timestamp("createdAt").defaultTo(knex.fn.now());
    //     table.timestamp("updatedAt").defaultTo(knex.fn.now());
    // });
};

exports.down = function (knex) {
    return knex.schema.dropTable("friend_requests");
};
