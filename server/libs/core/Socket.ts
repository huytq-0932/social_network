import Auth from "@libs/Auth";
import to from "await-to-js";
let user = null;
class Socket {
  //   ChatModel = ChatModel;
  // UserModel = UserModel;
  static connect = async (server) => {
    const io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });
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
      socket.on("join", async ({ fromId, toId }, callback) => {
        let [error, user] = await to(Auth.verify(token));
        if (!user) return callback("Token lỗi!");
        // socket.userId = user.id;
        let groupId = fromId > toId ? `${toId}-${fromId}` : `${fromId}-${toId}`;
        console.log("groupId ", groupId)

        socket.join(groupId);
        // io.of("/")
        //   .in(id)
        //   .clients(function (error, clients) {
        //     let active = clients
        //       .map((clientId) => {
        //         return io.sockets.connected[clientId].userId;
        //       })
        //       .filter((userId) => userId);
        //     io.to(id).emit("active", active);
        //   });
        callback();
      });

      socket.on(
        "sendMessage",
        async (
          {
            message,
            fromId,
            toId,
          }: { message: string; fromId: number; toId: number },
          callback
        ) => {
          let [error, user] = await to(Auth.verify(token));
          if (!user) return false;
          let groupId =
            fromId > toId ? `${toId}-${fromId}` : `${fromId}-${toId}`;
            
          io.to(groupId).emit("message", {
            fromId: fromId,
            content: message,
            toId: toId,
            createdAt: new Date(),
          });

          callback();
        }
      );

      //   socket.on("disconnect", async () => {});
    });
  };
}

export default Socket;
