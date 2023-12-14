import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./users.entity";

@Entity({ name: "friends_list" })
export class FriendsList {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ nullable: false })
  friends_id?: string;

  @Column({ default: false })
  friends_status!: boolean;

  @ManyToOne((type) => User, (user) => user.friends_list, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
