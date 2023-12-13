import * as express from "express";

import { UserController } from "../apis/users/users.controller";
import { UserService } from "../apis/users/users.services";

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router.get("/", (req, res) => {
  res.render("home.html");
});
router.get("/signup", (req, res) => {
  res.render("signup.html");
});
router.get("/rooms", (req, res) => {
  res.render("main.html");
});

router.get("/rooms/room1", (req, res) => {
  res.render("room_chat.html", { roomNum: 1 });
});

router.get("/rooms/room2", (req, res) => {
  res.render("room_chat.html", { roomNum: 2 });
});

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.get("/user", userController.findAllUser);

export default router;
