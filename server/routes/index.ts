import Route from "@core/Routes";

const ExtendMiddleware = require("@app/Middlewares/ExtendMiddleware");
const AuthApiMiddleware = require("@app/Middlewares/AuthApiMiddleware");

Route.group(() => {
  Route.post("/login", "UserController.login").name("login");
  Route.post("/signup", "UserController.signup").name("signup");
  Route.post("/get_verify_code", "UserController.getVerifyCode").name("getVerifyCode");
  Route.post("/all_users", "UserController.getAllUsers").name("getAllUsers");
  Route.post("/check_verify_code", "UserController.checkVerifyCode").name("checkVerifyCode");

  Route.group(() => {
    Route.resource("/users", "UserController").name("users");

    Route.post("/get_list_conversation", "GroupChatController.getListConversation").name(
      "getListConversation"
    );
    Route.post("/get_conversation", "GroupChatController.getConversation").name("getConversation");
    Route.post("/set_read_message", "GroupChatController.setReadMessage").name("setReadMessage");
    Route.post("/send_message", "GroupChatController.sendMessage").name("sendMessage");
    Route.post("/delete_message", "GroupChatController.deleteMessage").name("deleteMessage");
    Route.post("/delete_conversation", "GroupChatController.deleteConversation").name(
      "deleteConversation"
    );

    Route.post("/users/getByPhone", "UserController.getByPhone").name("getByPhone");
    Route.post("/change_password", "UserController.updatePassword").name("updatePassword");
    Route.post("/get_user_info", "UserController.getInfo").name("getInfo");
    Route.post("/set_user_info", "UserController.setUserInfo").name("setUserInfo");

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
    Route.post("/get_list_suggested_friends", "FriendshipController.getListSuggestedFriends").name(
      "getListSuggestedFriends"
    );

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

    //Notifications
    Route.post("/get_notification", "NotificationController.getNotification").name(
      "getNotification"
    );
    Route.post("/set_read_notification", "NotificationController.setReadNotification").name(
      "setReadNotification"
    );

    // Dev token
    Route.post("/set_devtoken", "DevtokenController.setDevtoken").name("setDevtoken");
    Route.post("/check_new_version", "DevtokenController.checkNewVersion").name("checkNewVersion");
  }).middleware([AuthApiMiddleware]);
})
  .middleware([ExtendMiddleware])
  .name("api");
