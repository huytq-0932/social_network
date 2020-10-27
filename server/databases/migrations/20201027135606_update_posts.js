exports.up = function (knex) {
  return knex.schema.table("posts", function (table) {
    table.renameColumn("content", "described");
    table.boolean("can_comment").notNullable().defaultTo(true);
    table.dropColumn("comment_status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("posts");
};
