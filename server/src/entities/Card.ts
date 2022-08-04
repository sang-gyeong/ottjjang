import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import List from "./List";
import User from "./User";

@Entity({ orderBy: { pos: "ASC" } })
export default class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  _uid!: number;

  @Column({ unique: true })
  id!: string;

  @Column()
  listId!: string;

  @Column()
  content!: string;

  @CreateDateColumn()
  createDate?: Date;

  @Column()
  pos!: number;

  @ManyToOne(() => List, (list) => list.cards, { onDelete: "CASCADE" })
  list!: List;

  @ManyToMany(() => User, (user) => user.cards, { onDelete: "CASCADE" })
  users!: User[];
}
