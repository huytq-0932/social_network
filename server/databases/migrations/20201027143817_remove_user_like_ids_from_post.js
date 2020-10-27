exports.up = function (knex) {
  return knex.schema.table("posts", function (table) {
    table.dropColumn("user_liked_ids");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("posts");
};
