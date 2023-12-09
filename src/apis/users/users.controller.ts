import { Request, Response } from "express";
import { HttpExceptionFilter } from "../../middleware/http-exception-filter";
import { UserService } from "./users.services";

export class UserController {
  constructor(private readonly userService: UserService) {}

  signUp = async (req: Request, res: Response) => {
    const userInfo = req.body;

    if (userInfo.id.length < 1)
      throw new HttpExceptionFilter(400, "이메일을 최소 1자이상 입력해주세요.");

    if (userInfo.password.length < 4)
      throw new HttpExceptionFilter(400, "비밀번호 최소 자리는 4자리입니다.");

    await this.userService.create(userInfo);

    return res.status(201).send({ success: true, msg: "ok" });
  };

  signIn = async (req: Request, res: Response) => {
    const loginInfo = req.body;

    if (loginInfo.id.length < 1)
      throw new HttpExceptionFilter(400, "이메일을 최소 1자이상 입력해주세요.");

    if (loginInfo.password.length < 4)
      throw new HttpExceptionFilter(400, "비밀번호 최소 자리는 4자리입니다.");

    const result = await this.userService.signIn(loginInfo);
    console.log(result);

    return res.status(200).send({ success: true, mgs: "ok" });
  };
}
