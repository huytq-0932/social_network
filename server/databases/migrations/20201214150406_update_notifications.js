exports.up = (knex) => {
  return knex.schema.alterTable("notifications", (table) => {
    table.string("object_id").notNullable().defaultTo("0").alter();
  });
};

exports.down = (knex) => {
  return knex.schema.alterTable("notifications", (table) => {
    table.string("object_id").nullable().alter();
  });
};
