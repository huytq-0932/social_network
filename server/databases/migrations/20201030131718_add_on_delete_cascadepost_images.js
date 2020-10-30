exports.up = function (knex) {
  return knex.schema.alterTable("post_images", (table) => {
    table.dropForeign("post_id");
    // table
    //   .integer("post_id")
    //   .notNullable()
    //   .index()
    //   .references("id")
    //   .inTable("posts")
    //   .onUpdate("CASCADE")
    //   .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("post_images", (table) => {
    table.dropForeign("post_id");
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
