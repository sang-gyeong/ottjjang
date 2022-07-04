import { Entity, BaseEntity, Column, CreateDateColumn } from "typeorm";

@Entity()
export default class List extends BaseEntity {
  @Column({ unique: true })
  id!: string;

  @Column()
  title!: string;

  @Column()
  color!: string;

  @CreateDateColumn()
  createDate!: Date;

  @Column()
  order!: number;
}
