import * as bcrypt from "bcrypt";
import { Not } from "typeorm";
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

  connectedAllUser = async (userId: string) => {
    // 본인 제외한 친구 정보 조회
    const users = await this.userRepository.find({
      where: { id: Not(userId) },
      relations: ["friends_list"],
    });

    console.log(users);

    const userData = users.map((el) => {
      // date날짜 formatting
      const originalDate = new Date(el.created_at);
      const year = originalDate.getFullYear();
      const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
      const day = originalDate.getDate().toString().padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      return {
        id: el.id,
        friends_count: el.friends_list.length,
        created_at: formattedDate,
      };
    });

    return userData;
  };
}
