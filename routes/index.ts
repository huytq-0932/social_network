import Route from '@core/Routes'
Route.group(() => {
  require("@root/server/routes")
}).prefix("/it4788")

require("./admin")
Route.router.use("/" ,require("express").static('@root/../public'));


