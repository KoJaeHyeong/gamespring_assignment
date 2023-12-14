import * as http from "http";
import { Server } from "socket.io";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Room } from "../users/entity/room.entity";

export class ChatGateway {
  public io: Server;

  constructor(
    private readonly repository: DataSource,
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

      socket.on("disconnect", () => {
        console.log("연결 해제");
      });

      //*****************************//
      //          ROOM CHAT          //
      //*****************************//

      // 룸채팅 퇴장 메시지 전달
      socket.on("leave_room", (data) => {
        socket.to(`${data.room}`).emit("leave_room_msg", `${data.message}`);
        socket.leave(data.roomNumber);
      });

      // 룸정보 수신
      socket.on("userInfo", (user) => {
        const room1Count =
          this.io.sockets.adapter.rooms.get("room1")?.size ?? 0;
        const room2Count =
          this.io.sockets.adapter.rooms.get("room2")?.size ?? 0;

        socket.emit("roomInfo", { room1: room1Count, room2: room2Count });
      });

      // 룸 입장
      socket.on("joinRoom", (data, cb) => {
        const { room, user_name } = data;

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

      //*****************************//
      //          PRIVATE CHAT       //
      //*****************************//

      let roomId: string = "";

      socket.on("private_join", async (data, callback) => {
        // 입장 메시지 표출 callback 함수
        callback();

        // 1대1 채팅 roomId 이미 존재하는지 확인
        const isExistedRoomId1 = await this.repository
          .getRepository(Room)
          .findOne({
            where: { chat_name1: data.userName, chat_name2: data.receiveName },
          });

        const isExistedRoomId2 = await this.repository
          .getRepository(Room)
          .findOne({
            where: {
              chat_name1: data.receiveName,
              chat_name2: data.userName,
            },
          });

        if (isExistedRoomId1?.room_id && isExistedRoomId2?.room_id) {
          roomId = isExistedRoomId1?.room_id;
        } else {
          // roomId를 통일 시키기 위함.
          let roomUniqueId = uuidv4();

          const room1 = await this.repository.getRepository(Room).save({
            room_id: roomUniqueId,
            chat_name1: data.userName,
            chat_name2: data.receiveName,
          });

          await this.repository.getRepository(Room).save({
            room_id: roomUniqueId,
            chat_name1: data.receiveName,
            chat_name2: data.userName,
          });
          roomId = room1.room_id;
        }

        // 1대1 개인 룸 join
        socket.join(roomId);
        socket.to(roomId).emit("private_user", { roomId, ...data });

        // 1대1 message 전달
        socket.on("private_msg", (data) => {
          socket.to(roomId).emit("private_msg", data);
        });

        socket.on("private_leave", (data) => {
          socket.leave(roomId);
        });
      });
    });
  };
}
