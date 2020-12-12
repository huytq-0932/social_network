exports.up = function (knex) {
    return knex.schema.table("chats", function (table) {
      table.jsonb("readed_user_ids").defaultTo("[]");
      table
      .integer("group_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("group_chats")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    });
  };
  exports.down = function(knex, Promise) {
    knex.schema.table('chats', function(table) {
        table.dropColumn("readed_user_ids");
        table.dropColumn("group_id");
    })
  }
  