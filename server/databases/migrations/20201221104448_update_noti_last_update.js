exports.up = function (knex) {
  return knex.schema.table("notifications", function (table) {
    table.timestamp("last_update").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.table("notifications", function (table) {
    table.dropColumn("last_update");
  });
};
