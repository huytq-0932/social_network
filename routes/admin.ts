import Route from '@core/Routes'
//const AuthAdminMiddleware = require('@app/Middlewares/AuthAdminMiddleware')

Route.get("/", "pages/index").name("dashboard.index")

Route.group(() => {

}).name("frontend.admin")
    //.middleware([AuthAdminMiddleware])

/*
Route.group(() => {
  const name = 'users'
  Route.get("/", `pages/admin/${name}`).name(`${name}.index`)
  Route.get("/create", `pages/admin/${name}/create`).name(`${name}.create`)
  Route.get("/:id/edit", `pages/admin/${name}/edit`).name(`${name}.edit`)
}).prefix('/users').middleware([AuthMiddleware]) */