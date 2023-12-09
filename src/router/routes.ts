import * as express from "express";

import { UserController } from "../apis/users/users.controller";
import { UserService } from "../apis/users/users.services";

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router.get("/", (req, res) => {
  res.render("main.html", { title: "Nunjucks" });
});

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

export default router;
