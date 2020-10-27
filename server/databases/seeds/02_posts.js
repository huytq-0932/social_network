exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("posts")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("posts").insert([
        {
          user_id: 8,
          described: "Bài viết của Bùi Việt Anh 0",
          state: 0,
          banned: 0,
        },
        {
          user_id: 8,
          described: "Bài viết của Bùi Việt Anh 1",
          state: 0,
          banned: 0,
        },
        {
          user_id: 8,
          described: "Bài viết của Bùi Việt Anh 2",
          state: 0,
          banned: 0,
        },
      ]);
    });
};
