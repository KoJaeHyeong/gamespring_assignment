import * as bcrypt from "bcrypt";
import { createConnection } from "../../../ormconfig";
import { HttpExceptionFilter } from "../../middleware/http-exception-filter";
import { User } from "./entity/users.entity";

export class UserService {
  constructor(
    private readonly userRepository = createConnection().getRepository(User)
  ) {}

  create = async (body: any): Promise<void> => {
    const { id, password } = body;
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) throw new HttpExceptionFilter(400, "이미 존재하는 아아디입니다.");

    const hasspassword = await bcrypt.hash(password, 10);

    await this.userRepository.save({
      id,
      password: hasspassword,
    });
  };

  signInUser = async (body: any): Promise<Boolean> => {
    const { id, password } = body;

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpExceptionFilter(400, "아이디가 존재하지 않습니다.");

    const isMathcPassword = await bcrypt.compare(password, user.password);

    if (!isMathcPassword)
      throw new HttpExceptionFilter(400, "비밀번호가 일치하지 않습니다.");

    return true;
  };

  connectedAllUser = async () => {
    const users = await this.userRepository.find({
      relations: ["friends_list"],
    });

    return users;
  };
}
