exports.up = function (knex) {
  return knex.schema.createTable("push_settings", function (table) {
    table.increments();
    table
      .integer("user_id")
      .notNullable()
      .index()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("like_comment").notNullable().defaultTo("0");
    table.string("from_friends").notNullable().defaultTo("0");
    table.string("request_friend").notNullable().defaultTo("0");
    table.string("suggest_friend").notNullable().defaultTo("0");
    table.string("birthday").notNullable().defaultTo("0");
    table.string("video").notNullable().defaultTo("0");
    table.string("report").notNullable().defaultTo("0");
    table.string("sound_on").notNullable().defaultTo("0");
    table.string("notification_on").notNullable().defaultTo("0");
    table.string("vibrant_on").notNullable().defaultTo("0");
    table.string("led_on").notNullable().defaultTo("0");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("push_settings");
};
