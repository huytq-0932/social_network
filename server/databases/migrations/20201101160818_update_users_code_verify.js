exports.up = function (knex) {
    return knex.schema.table("users", function (table) {
      table.string("code_verify").nullable();
      table.string("username").nullable();
    });
  };
  exports.down = function(knex, Promise) {
    knex.schema.table('users', function(table) {
        table.dropColumn("code_verify");
        table.dropColumn("username");
    })
  }
  
  