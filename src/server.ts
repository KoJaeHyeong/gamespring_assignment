import * as cors from "cors";
import * as express from "express";
import "express-async-errors";
import * as http from "http";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { Server } from "socket.io";
import { createConnection } from "../ormconfig";
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

    const room1 = io.of("/room1");
    const room2 = io.of("/room2");

    room1.on("connection", (socket) => {
      console.log("room1 네임스페이스에 접속", socket.id);

      socket.on("disconnect", () => {
        console.log("room1 네임스페이스 접속 해제");
      });

      socket.on("roomChat", (msg) => {
        console.log("server_msg1", msg);
        socket.emit("roomChat", msg);
      });
    });

    room2.on("connection", (socket) => {
      console.log("room2 네임스페이스에 접속");

      socket.on("disconnect", () => {
        console.log("room2 네임스페이스 접속 해제");
      });

      socket.on("roomChat", (msg) => {
        console.log("server_msg2", msg);
        socket.emit("room2", "방 만들어");
      });
    });
  }

  public async listen() {
    this.setMiddleWare();
    const server = http.createServer(this.app);

    // socket서버
    this.socketServer(server);
    //DB 및 server listening
    createConnection()
      .initialize()
      .then(() => {
        console.log(`🚀DB Initialized Success`);
        server.listen(port, () => {
          console.log(`🚀server listening on http://localhost:${port}`);
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
