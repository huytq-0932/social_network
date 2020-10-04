
exports.up = function(knex) {
    return knex.schema.createTable('fb_users', function(table) {
      table.increments();
      table.string('fbId').notNullable();
      table.string('name').nullable();
      table.string('email').nullable();
      table.string('password').nullable();
      table.text('cookie').notNullable();
      table.integer('status').defaultTo(0);
      table.integer('numFriend').defaultTo(0);
      table.integer('numGroup').defaultTo(0);
      table.jsonb('info').defaultTo({});
      table.jsonb('tags').defaultTo([]);
      table.timestamp("nextTimeAddFriend").defaultTo(knex.fn.now()).index()
      table.timestamp("nextTimeAcceptFriend").defaultTo(knex.fn.now()).index()
      table.timestamp("nextTimeJoinGroup").defaultTo(knex.fn.now()).index()
      table.timestamp("nextTimePost").defaultTo(knex.fn.now()).index()
      table.timestamp("nextTimeComment").defaultTo(knex.fn.now()).index()
      table.timestamp("nextTimeLike").defaultTo(knex.fn.now()).index()
      table.timestamp("nextTimeShare").defaultTo(knex.fn.now()).index()
      table.index("status")
      table.timestamp("nextTimeReaction").defaultTo(knex.fn.now()).index()
      table.timestamp("nextTimeSendMessage").defaultTo(knex.fn.now()).index()
      table.timestamp("nextTimeSearch").defaultTo(knex.fn.now()).index()
      table.string("followFbId").nullable()
      table.timestamp("nextTimeLikePage").defaultTo(knex.fn.now()).index()
      
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
      table.timestamp('deletedAt').nullable();
      table.integer('updatedBy').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('fb_users');
  };
  