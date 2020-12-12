import Route from "@core/Routes";

const ExtendMiddleware = require("@app/Middlewares/ExtendMiddleware");
const AuthApiMiddleware = require("@app/Middlewares/AuthApiMiddleware");

Route.group(() => {
  Route.post("/login", "UserController.login").name("login");
  Route.post("/signup", "UserController.signup").name("signup");
  Route.post("/get_verify_code", "UserController.getVerifyCode").name("getVerifyCode");
  Route.post("/all_users", "UserController.getAllUsers").name("getAllUsers");

  Route.group(() => {
    
    Route.resource("/users", "UserController").name("users");
    Route.post("/users/getByPhone", "UserController.getByPhone").name("getByPhone");
    Route.post("/change_password", "UserController.updatePassword").name("updatePassword");
    Route.post("/get_user_info", "UserController.getInfo").name("getInfo");
    Route.post("/set_user_info", "UserController.setUserInfo").name("setUserInfo");
    Route.post("/check_verify_code", "UserController.checkVerifyCode").name("checkVerifyCode");
    Route.post("/change_info_after_signup", "UserController.changeInfoAfterSignup").name(
      "changeInfoAfterSignup"
    );
    Route.post("/get_user_friends", "FriendshipController.getUserFriends").name("getUserFriends");
    Route.post("/set_accept_friend", "FriendshipController.setAcceptFriend").name(
      "setAcceptFriend"
    );
    Route.post("/set_request_friend", "FriendshipController.setRequestFriend").name(
      "setRequestFriend"
    );
    Route.post("/get_requested_friends", "FriendshipController.getRequestedFriends").name(
      "getRequestedFriends"
    );
    Route.post("/set_block", "FriendshipController.setBlock").name("setBlock");
    Route.post("/get_list_blocks", "FriendshipController.getListBlocks").name("getListBlocks");

    // Post
    Route.post("/check_new_item", "PostController.checkNewItem").name("checkNewItem");
    Route.post("/get_list_posts", "PostController.getListPosts").name("getListPosts");
    Route.post("/get_list_videos", "PostController.getListVideos").name("getListVideos");
    Route.post("/get_post", "PostController.getPostById").name("getPostById");
    Route.post("/add_post", "PostController.createPost").name("createPost");
    Route.post("/delete_post", "PostController.deletePostById").name("deletePostById");
    Route.post("/edit_post", "PostController.editPost").name("editPost");
    Route.post("/report_post", "ReportPostController.reportPost").name("reportPost");
    Route.post("/like", "LikeController.like").name("like");

    // Comment
    Route.post("/get_comment", "CommentController.getComment").name("getComment");
    Route.post("/set_comment", "CommentController.setComment").name("setComment");

    // Search
    Route.post("/get_saved_search", "SearchController.getSavedSearch").name("getSavedSearch");
    Route.post("/del_saved_search", "SearchController.delSavedSearch").name("delSavedSearch");
    Route.post("/search", "SearchController.searchPost").name("searchPost");

    //Push setting
    Route.post("/get_push_settings", "PushSettingController.getPushSetting").name("getPushSetting");
    Route.post("/set_push_settings", "PushSettingController.setPushSetting").name("setPushSetting");
  }).middleware([AuthApiMiddleware]);
})
  .middleware([ExtendMiddleware])
  .name("api");
