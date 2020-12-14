exports.up = function (knex) {
  return knex.schema.createTable("notifications", function (table) {
    table.increments();
    table
      .integer("user_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("type").nullable();
    table.string("object_id").nullable();
    table.string("title").nullable();
    table.timestamp("created").defaultTo(knex.fn.now());
    table.string("avatar").nullable();
    table.string("group").notNullable().defaultTo("0");
    table.string("read").notNullable().defaultTo("0");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("notifications");
};
