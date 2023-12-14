import * as bcrypt from "bcrypt";
import { Not } from "typeorm";
import { createConnection } from "../../../ormconfig";
import { HttpExceptionFilter } from "../../middleware/http-exception-filter";
import { FriendsList } from "./entity/friends.entity";
import { User } from "./entity/users.entity";

export class UserService {
  constructor(
    private readonly userRepository = createConnection().getRepository(User),
    private readonly friendsRepository = createConnection().getRepository(
      FriendsList
    )
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

  //todo 공통으로 뺼것!

  formatDate(date: any) {
    const originalDate = new Date(date);
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    const day = originalDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  connectedAllUser = async (userId: string) => {
    // 본인 제외한 친구 정보 조회
    const users = await this.userRepository.find({
      where: { id: Not(userId) },
      relations: ["friends_list"],
    });

    const userData = users.map((el) => {
      // date날짜 formatting
      // const originalDate = new Date(el.created_at);
      // const year = originalDate.getFullYear();
      // const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
      // const day = originalDate.getDate().toString().padStart(2, "0");

      const formattedDate = this.formatDate(el.created_at);

      const friendsList = el.friends_list.filter(
        (e) => e.friends_status === true && e.friends_id === userId
      );

      let friendStatus: boolean = false;

      for (const item of friendsList) {
        console.log("item", item);

        if (item.friends_id === userId) {
          friendStatus = item.friends_status;
        }
      }

      return {
        id: el.id,
        friends_count: friendsList.length,
        friends_status: friendStatus,
        created_at: formattedDate,
      };
    });

    return userData;
  };

  requestFriends = async (friendsId: string, user: string) => {
    console.log(friendsId, user);
    try {
      // 이미 요청 되어있는지 확인
      const confirmFriend = await this.friendsRepository.findOne({
        where: { friends_id: friendsId, user: { id: user } },
      });

      if (confirmFriend) {
        return false;
      } else {
        await this.friendsRepository.save({
          friends_id: friendsId,
          request_id: user,
          user: { id: user },
        });

        await this.friendsRepository.save({
          friends_id: user,
          request_id: user,
          user: { id: friendsId },
        });

        return true;
      }
    } catch (error) {
      console.log(error);

      throw new HttpExceptionFilter(500, String(error));
    }
  };

  requesteFriendsBox = async (userId: string) => {
    try {
      const friends = await this.friendsRepository.find({
        where: {
          user: { id: userId },
          friends_status: false,
          request_id: Not(userId),
        },
        // relations: ["user"],
      });

      console.log(friends);

      const newData = Promise.all(
        friends.map(async (user) => {
          const createdAtUser = await this.userRepository.findOne({
            where: { id: user.friends_id },
            select: ["created_at"],
          });

          const formatDate = this.formatDate(createdAtUser?.created_at);

          const newFriendList = {
            ...user,
            user_created_at: formatDate,
          };

          return newFriendList;
        })
      );

      return newData;
    } catch (error) {
      console.log(error);
    }
  };

  acceptRequest = async (userId: string, friendsId: string) => {
    try {
      const result1 = await this.friendsRepository.update(
        { user: { id: userId }, friends_id: friendsId },
        { friends_status: true }
      );

      const result2 = await this.friendsRepository.update(
        { user: { id: friendsId }, friends_id: userId },
        { friends_status: true }
      );

      if (result1.affected === 1 && result2.affected === 1) {
        return true;
      }
    } catch (error) {
      throw new HttpExceptionFilter(400, "친구 수락 실패!!");
    }
  };

  rejectRequest = async (userId: string, friendsId: string) => {
    try {
      const result1 = await this.friendsRepository.delete({
        user: { id: userId },
        friends_id: friendsId,
      });

      const result2 = await this.friendsRepository.delete({
        user: { id: friendsId },
        friends_id: userId,
      });

      if (result1.affected === 1 && result2.affected === 1) {
        return true;
      }
    } catch (error) {
      throw new HttpExceptionFilter(400, "친구 거절 실패!!");
    }
  };

  allFriendsList = async (userId: string) => {
    try {
      const friends = await this.friendsRepository.find({
        where: { user: { id: userId }, friends_status: true },
      });

      const newData = Promise.all(
        friends.map(async (user) => {
          const createdAtUser = await this.userRepository.findOne({
            where: { id: user.friends_id },
            select: ["created_at"],
          });

          const formatDate = this.formatDate(createdAtUser?.created_at);

          const newFriendList = {
            ...user,
            user_created_at: formatDate,
          };

          return newFriendList;
        })
      );

      return newData;
    } catch (error: any) {
      throw new HttpExceptionFilter(500, error);
    }
  };
}
