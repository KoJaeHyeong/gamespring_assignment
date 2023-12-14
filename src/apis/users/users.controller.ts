import { Request, Response } from "express";
import { HttpExceptionFilter } from "../../middleware/http-exception-filter";
import { UserService } from "./users.services";

export class UserController {
  constructor(private readonly userService: UserService) {}

  signUp = async (req: Request, res: Response) => {
    const userInfo = req.body;

    console.log("userInfo", userInfo);

    if (userInfo.id.length < 1)
      throw new HttpExceptionFilter(400, "아이디를 최소 1자이상 입력해주세요.");

    if (userInfo.password.length < 4)
      throw new HttpExceptionFilter(400, "비밀번호 최소 자리는 4자리입니다.");

    await this.userService.create(userInfo);

    return res.status(201).send({ success: true, msg: "ok" });
  };

  signIn = async (req: Request, res: Response) => {
    const loginInfo = req.body;

    if (loginInfo.id.length < 1)
      throw new HttpExceptionFilter(400, "아이디를 최소 1자이상 입력해주세요.");

    if (loginInfo.password.length < 4)
      throw new HttpExceptionFilter(400, "비밀번호 최소 자리는 4자리입니다.");

    const result = await this.userService.signInUser(loginInfo);
    console.log(result);

    return res.status(200).send({ success: true, msg: "ok" });
  };

  findAllUserList = async (req: Request, res: Response) => {
    const userId = req.params.id;

    const result = await this.userService.connectedAllUser(userId);

    return res.status(200).send({ sucess: true, data: result });
  };

  requestFriends = async (req: Request, res: Response) => {
    const { friends_id, user } = req.body;
    const result = await this.userService.requestFriends(friends_id, user);

    return res.status(201).send({ success: true, msg: result });
  };

  requestedBox = async (req: Request, res: Response) => {
    const userId = req.params.id;
    console.log(userId);

    const result = await this.userService.requesteFriendsBox(userId);

    return res.status(200).send({ success: true, data: result });
  };

  acceptRequest = async (req: Request, res: Response) => {};

  rejectRequest = async (req: Request, res: Response) => {};
}
