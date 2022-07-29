import { orderBy } from "lodash";
import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import Card from "./Card";

@Entity({ orderBy: { pos: "ASC" } })
export default class List extends BaseEntity {
  @PrimaryGeneratedColumn()
  _uid!: number;

  @Column({ unique: true })
  id!: string;

  @Column()
  title!: string;

  @Column()
  color!: string;

  @CreateDateColumn()
  createDate?: Date;

  @Column()
  pos!: number;

  @OneToMany(() => Card, (card) => card.list, { cascade: true })
  cards!: Card[];
}
