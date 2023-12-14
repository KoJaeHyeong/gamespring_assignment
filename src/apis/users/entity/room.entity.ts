import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "room",
})
export class Room {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  room_id!: string;

  @Column()
  chat_name1!: string;

  @Column()
  chat_name2!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
