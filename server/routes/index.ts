import Route from "@core/Routes";

const ExtendMiddleware = require("@app/Middlewares/ExtendMiddleware");
const AuthApiMiddleware = require("@app/Middlewares/AuthApiMiddleware");
const {
  permission,
  permissionResource,
  permissionMethod
} = require("@app/Middlewares/PermissionMiddleware");

Route.group(() => {
  Route.post("/login", "UserController.login").name("login");
  Route.post("/signup", "UserController.signup").name("signup");

  Route.group(() => {
    Route.resource("/users", "UserController").name("users");
    Route.put("/change_password", "UserController.updatePassword").name(
      "updatePassword"
    );
    Route.resource("/get_user_info", "UserController.getInfo").name("getInfo");

    // Post
    Route.get("/get_post", "PostController.getPostById").name("getPostById");
    Route.post("/add_post", "PostController.createPost").name("createPost");
    Route.delete("/delete_post", "PostController.deletePostById").name(
      "deletePostById"
    );
    Route.put("/edit_post", "PostController.editPost").name("editPost");
  }).middleware([AuthApiMiddleware]);
})
  .middleware([ExtendMiddleware])
  .name("api");
