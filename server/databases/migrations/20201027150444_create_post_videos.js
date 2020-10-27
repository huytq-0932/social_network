exports.up = function (knex) {
  return knex.schema.createTable("post_videos", function (table) {
    table.increments();
    table
      .integer("post_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("posts")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    table.string("url").notNullable();
    table.string("thumb").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("post_videos");
};
