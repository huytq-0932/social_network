
exports.seed = function (knex, Promise) {

  let initObj = {
    username: 'root',
    password: '$2b$10$iNT.d38.rdsRvRMU95WTSu0ZMUBi/Dbwsrzw7yu0vT60T9EPu8eNi', //123456@
    isRoot: 1
  };

  // Deletes ALL existing entries
  return knex('admins').del()
    .then(async () => {
      // Inserts seed entries
      await knex('admins').insert(initObj);
      await knex.raw('select setval(\'admins_id_seq\', max(id)) from admins');
    });
};