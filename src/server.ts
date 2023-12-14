import * as cors from "cors";
import * as express from "express";
import "express-async-errors";
import * as http from "http";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { createConnection } from "../ormconfig";
import { ChatGateway } from "./apis/chat/chat.gateway";
import { httpExceptionMiddleware } from "./middleware/http-exception-filter";
import endRouter from "./router/routes";

// const port = 3000;

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

  public async listen() {
    this.setMiddleWare();
    const server = http.createServer(this.app);

    //DB 및 server listening
    createConnection()
      .initialize()
      .then(() => {
        console.log(`🚀DB Initialized Success`);
        server.listen(process.env.PORT, () => {
          console.log(
            `🚀server listening on http://localhost:${process.env.PORT}`
          );

          // socket_server 인스턴스 생성
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
