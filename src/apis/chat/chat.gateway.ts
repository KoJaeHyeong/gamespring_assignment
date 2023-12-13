import * as http from "http";
import { Server } from "socket.io";
import { DataSource } from "typeorm";

export class ChatGateway {
  public io: Server;

  constructor(
    //.getRepository(User),
    private readonly userRepository: DataSource,
    private readonly server: http.Server
  ) {
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.io = io;
  }

  socketListen = () => {
    this.io.on("connection", (socket) => {
      console.log("연결 성공");
      console.log("server", socket.id);

      // 룸정보 수신
      socket.on("userInfo", (user) => {
        const connectedUser = user;
        console.log("user : ", connectedUser);
        console.log("user : ", socket.id);
        const room1Count =
          this.io.sockets.adapter.rooms.get("room1")?.size ?? 0;
        const room2Count =
          this.io.sockets.adapter.rooms.get("room2")?.size ?? 0;

        socket.emit("roomInfo", { room1: room1Count, room2: room2Count });
      });

      // 룸 입장
      socket.on("joinRoom", (data, cb) => {
        console.log("room:", data);
        const { room, user_name } = data;
        socket.join(room);
        socket.to(room).emit("newUser", data);
        cb();
      });

      // 룸 채팅방 채팅
      socket.on("send_msg", (data) => {
        const { room, message } = data;
        console.log("서버 RoomChat 통신", message);

        console.log("서버 RoomChat 통신", room);
        socket.to(room).emit("roomChat", data);
      });

      socket.on("disconnect", () => {
        console.log("연결 해제");
        socket.on("leave_room", (data) => {
          console.log("SERVER_LEAVE_ROOM");

          socket.leave(data);
        });
      });
    });
  };
}
