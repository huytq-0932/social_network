exports.up = function (knex) {
    return knex.schema.table("users", function (table) {
      table.integer("is_verify").defaultTo(0);
      table.integer("activeStatus").defaultTo(1).comment("1: active, 2: blocked");
      table.timestamp("last_verify_at").defaultTo();
    });
  };
  exports.down = function(knex, Promise) {
    knex.schema.table('users', function(table) {
        table.dropColumn("is_verify");
        table.dropColumn("activeStatus");
        table.dropColumn("last_verify_at");
    })
  }
  
  