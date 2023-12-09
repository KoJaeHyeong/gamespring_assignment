import * as express from "express";
import "express-async-errors";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { createConnection } from "../ormconfig";
import { httpExceptionMiddleware } from "./middleware/http-exception-filter";
import endRouter from "./router/routes";

const port = 3000;

class Server {
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
    nunjucks.configure("views", {
      express: this.app,
      watch: true,
    });
    this.app.use(express.json());
    this.setRoute();
    this.app.use(httpExceptionMiddleware);
  }

  public async listen() {
    this.setMiddleWare();

    createConnection()
      .initialize()
      .then(() => {
        console.log(`🚀DB Initialized Success`);
        this.app.listen(port, () => {
          console.log(`🚀server listening on http://localhost:${port}`);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function init() {
  const server = new Server();
  server.listen();
}

init();
