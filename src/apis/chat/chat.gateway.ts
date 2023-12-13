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
    let room1List: string[] = [];
    this.io.on("connection", (socket) => {
      console.log("연결 성공");

      // 룸 퇴장 메시지 전달
      socket.on("leave_room", (data) => {
        socket.to(`${data.room}`).emit("leave_room_msg", `${data.message}`);
        socket.leave(data);
      });

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
        console.log("user_name", user_name);

        // if (!room1List.some((el) => el === user_name)) {
        //   room1List.push(user_name);
        // }

        // 유저 목록
        // console.log("room1List", room1List);

        socket.join(room);
        socket.to(room).emit("newUser", data, room1List);

        // 입장 메시지 표출 콜백함수
        cb();
      });

      // 룸 채팅방 채팅
      socket.on("send_msg", (data) => {
        const { room, message } = data;
        socket.to(room).emit("roomChat", data);
      });

      socket.on("disconnect", () => {
        console.log("연결 해제");
      });
    });
  };
}
