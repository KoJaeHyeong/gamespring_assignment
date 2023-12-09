import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { FriendsList } from "./friends.entity";

@Entity({
  name: "user",
})
export class User {
  @PrimaryColumn({ unique: true })
  id!: string;

  @Column()
  password!: string;

  @OneToMany((type) => FriendsList, (friends_list) => friends_list.user, {
    cascade: true,
  })
  friends_list!: FriendsList[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
