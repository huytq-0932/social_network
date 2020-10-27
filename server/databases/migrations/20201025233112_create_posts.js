exports.up = function (knex) {
  return knex.schema.createTable("posts", function (table) {
    table.increments();
    table
      .integer("user_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    table.text("content").notNullable();
    table
      .integer("comment_status")
      .nullable()
      .comment("0: được comment, 1: khóa comment");
    table.integer("state").nullable().comment("Trạng thái của bài viết");
    table.jsonb("user_liked_ids").nullable().defaultTo("[]");
    table.string("banned").nullable().comment("trạng thái bị khóa");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("posts");
};
