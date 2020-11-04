exports.up = function (knex) {
  return knex.schema.createTable("report_posts", function (table) {
    table.increments();
    table
      .integer("post_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("posts")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("subject").nullable();
    table.string("detail").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("report_posts");
};
