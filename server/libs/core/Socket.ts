import Auth from "@libs/Auth";
import to from "await-to-js";
import ChatModel from "@root/server/app/Models/ChatModel";
import UserModel from "@root/server/app/Models/UserModel";

let user = null;
class Socket {
  ChatModel = ChatModel;
  UserModel = UserModel;
  static connect(server) {
    const io = require("socket.io")(server,  {cors: {
        origin: "*"
      }});
    console.log("socket.io was connected!");
    // middleware
    io.use(async (socket, next) => {
      let token = socket.handshake.query.token;
      let [error, result] = await to(Auth.verify(token));
      if (!error) {
        user = result;
        return next();
      }
      return next(new Error("authentication error"));
    });

    io.on("connect", (socket) => {
      let token = socket.handshake.query.token;
      console.log("token ", token);
      socket.on("join", async ({ id }, callback) => {
        console.log("token ", token);
        let [error, user] = await to(Auth.verify(token));
        if (!user) return callback("Không tồn tại người dùng trong hệ thống!");
        socket.userId = user.id;

        socket.join(id);
        io.of("/")
          .in(id)
          .clients(function (error, clients) {
            let active = clients
              .map((clientId) => {
                return io.sockets.connected[clientId].userId;
              })
              .filter((userId) => userId);
            io.to(id).emit("active", active);
          });
        callback();
      });

      socket.on(
        "sendMessage",
        async ({ message, id }: { message: string; id: number }, callback) => {
          let [error, user] = await to(Auth.verify(token));
          if (!user) return false;
          let loginUser = await UserModel.query().findById(user.id);
          await ChatModel.query().insert({
            send_id: user.id,
            content: message,
          });

          io.to(id).emit("message", {
            userId: loginUser.id,
            content: message,
            user_name: loginUser.name,
            createdAt: new Date(),
          });

          callback();
        }
      );

      socket.on("disconnect", async () => {});
    });
  }
}

export default Socket;
