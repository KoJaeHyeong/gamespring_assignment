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
    // interface IConnectedUser {
    //   user_name: string;
    //   socket_id: string;
    // }
    // const rooms = new Set([{ room: 1 }]);

    this.io.on("connection", (socket) => {
      console.log("연결 성공");

      // 룸정보 수신
      socket.on("userInfo", (user) => {
        const connectedUser = user;
        // console.log(socket.nsp);
        socket.emit("userInfo", connectedUser);
        console.log("user : ", connectedUser);
      });
      // room에 접속
      socket.on("joinRoom", (roomNum, name) => {
        let roomName = roomNum;
        socket.join(roomName);
        const room = this.io.sockets.adapter.rooms.get(roomName);
        const room2 = this.io.sockets.adapter.rooms;
        // console.log(io.sockets.adapter);
        // console.log(room);
        console.log("room", room);

        if (room) {
          console.log("@@");

          const usersInRoom = Array.from(room);
          socket.emit("userInfo", name);
        }
      });

      socket.emit("roomList", ["room1", "room2"]);

      socket.on("roomList", (data) => {
        console.log("data", data);
      });

      socket.on("roomChat", (msg) => {
        socket.to("room1").emit("roomChat", msg, "me");
      });

      socket.on("disconnect", () => {
        socket.leave("room_1");
        console.log("연결 해제");
      });
    });
  };
}
