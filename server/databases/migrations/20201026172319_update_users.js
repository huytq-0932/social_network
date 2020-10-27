exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.string("description").nullable();
    table.string("cover_image").nullable();
    table.string("link").nullable();
    table.string("address").nullable();
    table.string("city").nullable();
    table.string("country").nullable();
    table.string("listing").nullable();
    table.string("is_friend").nullable();
    table.string("online").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
