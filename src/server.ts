import * as cors from "cors";
import * as express from "express";
import "express-async-errors";
import * as http from "http";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { Server } from "socket.io";
import { createConnection } from "../ormconfig";
import { ChatGateway } from "./apis/chat/chat.gateway";
import { httpExceptionMiddleware } from "./middleware/http-exception-filter";
import endRouter from "./router/routes";

const port = 3000;

class InitServer {
  public app: express.Application;

  constructor() {
    const app: express.Application = express();
    this.app = app;
  }

  private setRoute() {
    this.app.use(endRouter);
  }

  private setMiddleWare() {
    this.app.set("view engine", "html");
    // this.app.use(
    //   "/socket.io",
    //   express.static(path.join(__dirname, "node_modules/socket.io-client/dist"))
    // );
    this.app.use("/public", express.static(path.join("public")));
    this.app.use(
      "/socket.io",
      express.static(path.join(__dirname, "node_modules/socket.io-client/dist"))
    );

    nunjucks.configure("views", {
      express: this.app,
      watch: true,
    });
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );
    this.setRoute();
    this.app.use(httpExceptionMiddleware);
  }

  private socketServer(server: http.Server) {
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    interface IConnectedUser {
      user_name: string;
      socket_id: string;
    }

    const rooms = new Set([{ room: 1 }]);
    io.on("connection", (socket) => {
      console.log("연결 성공");

      // 룸정보 수신
      socket.on("userInfo", (user) => {
        const connectedUser = user;
        // console.log(socket.nsp);
        socket.emit("userInfo", connectedUser);
        console.log("user : ", connectedUser);
      });

      // console.log("socket_info", socket);
      // 로그인 한 유저
      // console.log(Array.from(rooms));

      // room에 접속
      socket.on("joinRoom", (roomNum, name) => {
        let roomName = roomNum;
        socket.join(roomName);
        const room = io.sockets.adapter.rooms.get(roomName);
        const room2 = io.sockets.adapter.rooms;
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

      // socket.on("joinRoom", (data) => {
      //   console.log("joinRoom", data);
      //   socket.join(data);
      //   socket.emit("send", "HIHIHIHI");
      // });
      // socket.on("roomInfo", (data: any) => {
      //   console.log("data", data);
      // });

      // console.log("rooms", socket.rooms);
      // console.log("rooms", socket);
      // const req = socket.request;
      // // console.log("req", req);

      // const {
      //   headers: { referer },
      // } = req;

      // console.log("referer", referer);

      // const roomId = referer
      //   ?.split("/")
      //   [referer.split("/").length - 1].replace(/\?.+/, "");

      // console.log("roomId", roomId);

      socket.on("disconnect", () => {
        socket.leave("room_1");
        console.log("연결 해제");
      });

      // socket.on("home", (data) => {
      //   console.log("클라이언트", socket.client["id"]);
      //   // console.log("클라이언트", socket.client["nsps"]);

      //   console.log("chat :", data);

      //   // socket.emit("news", `SERVER ${data}, ${socket.client["id"]}`);
      // });
      // socket.emit("news", "SERVER SEND 전송");
    });

    // room1.on("connection", (socket) => {
    //   console.log("room1 네임스페이스에 접속", socket.id);

    //   socket.on("disconnect", () => {
    //     console.log("room1 네임스페이스 접속 해제");
    //   });

    //   socket.on("roomChat", (msg) => {
    //     console.log("server_msg1", msg);
    //     socket.emit("roomChat", msg);
    //   });
    // });

    // room2.on("connection", (socket) => {
    //   console.log("room2 네임스페이스에 접속");

    //   socket.on("disconnect", () => {
    //     console.log("room2 네임스페이스 접속 해제");
    //   });

    //   socket.on("roomChat", (msg) => {
    //     console.log("server_msg2", msg);
    //     socket.emit("room2", "방 만들어");
    //   });
    // });
  }

  public async listen() {
    this.setMiddleWare();
    const server = http.createServer(this.app);

    // socket서버
    // this.socketServer(server);

    //DB 및 server listening
    createConnection()
      .initialize()
      .then(() => {
        console.log(`🚀DB Initialized Success`);
        server.listen(port, () => {
          console.log(`🚀server listening on http://localhost:${port}`);
          new ChatGateway(createConnection(), server).socketListen();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// 서버 개방
function init() {
  const server = new InitServer();
  server.listen();
}

init();
