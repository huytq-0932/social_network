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
    Route.get("/get_user_info", "UserController.getInfo").name("getInfo");
    Route.post("/get_verify_code", "UserController.getVerifyCode").name(
      "getVerifyCode"
    );
    Route.post("/check_verify_code", "UserController.checkVerifyCode").name(
      "checkVerifyCode"
    );
    Route.post(
      "/change_info_after_signup",
      "UserController.changeInfoAfterSignup"
    ).name("changeInfoAfterSignup");

    // Post
    Route.post("/get_list_posts", "PostController.getListPosts").name(
      "getListPosts"
    );
    Route.get("/get_post", "PostController.getPostById").name("getPostById");
    Route.post("/add_post", "PostController.createPost").name("createPost");
    Route.delete("/delete_post", "PostController.deletePostById").name(
      "deletePostById"
    );
    Route.put("/edit_post", "PostController.editPost").name("editPost");
    Route.post("/report_post", "ReportPostController.reportPost").name(
      "reportPost"
    );
    Route.post("/like", "LikeController.like").name("like");

    // Comment
    Route.post("/get_comment", "CommentController.getComment").name(
      "getComment"
    );
    Route.post("/set_comment", "CommentController.setComment").name(
      "setComment"
    );
  }).middleware([AuthApiMiddleware]);
})
  .middleware([ExtendMiddleware])
  .name("api");
