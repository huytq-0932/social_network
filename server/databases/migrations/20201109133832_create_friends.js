exports.up = function (knex) {
    // return knex.schema.createTable("friends", function (table) {
    //     table.dropColumn("status").nullable();
    //     table.dropColumn("action_user_id").nullable();
    //     table.integer("status").nullable();
    //     table.integer("action_user_id").nullable();
    // });
};

exports.down = function (knex) {
    return knex.schema.dropTable("friends");
};
