exports.up = function (knex) {
    return knex.schema.table("users", function (table) {
      table.integer("is_verify").defaultTo(0);
      table.timestamp("last_verify_at").defaultTo();
    });
  };
  exports.down = function(knex, Promise) {
    knex.schema.table('users', function(table) {
        table.dropColumn("is_verify");
        table.dropColumn("last_verify_at");
    })
  }
  
  