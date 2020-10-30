exports.up = function (knex) {
  return knex.schema.table("posts", function (table) {
    table.string("auto_accept").notNullable().defaultTo("1");
    table.string("auto_block").notNullable().defaultTo("0");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("posts");
};
