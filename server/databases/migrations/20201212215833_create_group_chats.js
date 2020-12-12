exports.up = function (knex) {
    return knex.schema.createTable("group_chats", function (table) {
      table.increments();
      table.jsonb("user_ids").defaultTo("[]");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("group_chats");
  };
  