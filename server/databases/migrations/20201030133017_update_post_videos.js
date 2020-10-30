exports.up = function (knex) {
  return knex.schema.alterTable("post_videos", (table) => {
    table.dropForeign("post_id");
    table
      .foreign("post_id")
      .references("posts.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("post_videos", (table) => {
    table.dropForeign("post_id");
    table
      .foreign("post_id")
      .references("posts.id")
      .onUpdate("NO ACTION")
      .onDelete("NO ACTION");
  });
};
