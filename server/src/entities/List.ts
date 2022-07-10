import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
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
  order!: number;
}
