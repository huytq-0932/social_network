exports.up = function (knex) {
  return knex.schema.table("post_images", function (table) {
    table.integer("index").notNullable().defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("post_images");
};
