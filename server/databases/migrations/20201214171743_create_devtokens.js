exports.up = function (knex) {
  return knex.schema.createTable("devtokens", function (table) {
    table.increments();
    table
      .integer("user_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("devtype").notNullable().defaultTo("0");
    table.string("devtoken").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("devtokens");
};
