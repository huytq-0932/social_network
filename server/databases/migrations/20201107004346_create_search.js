exports.up = function (knex) {
  return knex.schema.createTable("search", function (table) {
    table.increments();
    table
      .integer("user_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.text("keyword").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("search");
};
