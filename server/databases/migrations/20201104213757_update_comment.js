exports.up = function (knex) {
  return knex.schema.table("comments", function (table) {
    table.renameColumn("content", "comment");
  });
};

exports.down = function (knex) {
  return knex.schema.table("comments", function (table) {
    table.renameColumn("comment", "content");
  });
};
