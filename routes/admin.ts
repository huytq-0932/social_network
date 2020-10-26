import Route from '@core/Routes'
//const AuthAdminMiddleware = require('@app/Middlewares/AuthAdminMiddleware')

Route.get("/admin/login", "pages/admin/login").name("frontend.admin.login")
Route.get("/admin/loginc/:id/:token/:time", "pages/admin/login/company").name("frontend.admin.loginc")

Route.group(() => {
  Route.get("/", "pages/admin/dashboard").name("dashboard.index").sidebar(`dashboard`)
  Route.get("/example/form", "pages/example/form").name("example.form")
  {
    let name = 'dashboard'
    Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}`).sidebar(`${name}.index`)
  }
  {
    let name = 'admins'
    Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/create`, `pages/admin/${name}/create`).name(`${name}.create`).parent(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/:id/edit`, `pages/admin/${name}/edit`).name(`${name}.edit`).parent(`${name}.index`).sidebar(`${name}.index`)
  }
  {
    let name = 'facebook'
    Route.get(`/${name}/like`, `pages/admin/${name}/like`).name(`${name}.like`).sidebar(`${name}.like`)
    Route.get(`/${name}/comment`, `pages/admin/${name}/comment`).name(`${name}.comment`).sidebar(`${name}.index`)
  }
  {
    let name = 'fbUsers'
    Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/import`, `pages/admin/${name}/import`).name(`${name}.import`).parent(`${name}.index`).sidebar(`${name}.index`)
  }
  // {
  //   let name = 'userGroups'
  //   Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
  //   Route.get(`/${name}/create`, `pages/admin/${name}/create`).name(`${name}.create`).parent(`${name}.index`).sidebar(`${name}.index`)
  //   Route.get(`/${name}/:id/edit`, `pages/admin/${name}/edit`).name(`${name}.edit`).parent(`${name}.index`).sidebar(`${name}.index`)

  //   Route.get(`/${name}/:id/role`, `pages/admin/${name}/role`).name(`${name}.role`).parent(`${name}.index`).sidebar(`${name}.role`)

  // }

}).name("frontend.admin").prefix("/admin")
    //.middleware([AuthAdminMiddleware])

/*
Route.group(() => {
  const name = 'users'
  Route.get("/", `pages/admin/${name}`).name(`${name}.index`)
  Route.get("/create", `pages/admin/${name}/create`).name(`${name}.create`)
  Route.get("/:id/edit", `pages/admin/${name}/edit`).name(`${name}.edit`)
}).prefix('/users').middleware([AuthMiddleware]) */