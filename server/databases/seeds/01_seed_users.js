exports.seed = function (knex, Promise) {
  let initObj = {
    name: "root",
    password: "$2b$10$iNT.d38.rdsRvRMU95WTSu0ZMUBi/Dbwsrzw7yu0vT60T9EPu8eNi", //123456@
  };

  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(async () => {
      // Inserts seed entries
      await knex("users").insert(initObj);
      await knex.raw("select setval('users_id_seq', max(id)) from users");
    });
};
