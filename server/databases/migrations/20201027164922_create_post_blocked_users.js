exports.up = function (knex) {
  return knex.schema.createTable("post_blocked_users", function (table) {
    table.increments();
    table
      .integer("user_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    table
      .integer("post_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("posts")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("post_blocked_users");
};
