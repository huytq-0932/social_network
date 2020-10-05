import Route from '@core/Routes'

const ExtendMiddleware = require("@app/Middlewares/ExtendMiddleware");
const AuthApiMiddleware = require('@app/Middlewares/AuthApiMiddleware')
const { permission, permissionResource, permissionMethod } = require('@app/Middlewares/PermissionMiddleware')
  
Route.group(() => {
  Route.post("/login", "AdminController.login").name('login')
  
  Route.group(() => {
    Route.resource("/users", "UserController").name('users')
  }).middleware([AuthApiMiddleware])
}).middleware([ExtendMiddleware]).name('api')