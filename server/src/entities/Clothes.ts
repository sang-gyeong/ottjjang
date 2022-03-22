import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";
import { forEach, includes, map } from "lodash";
import { resolve } from "path";

@Entity()
export default class Clothes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  key!: string;

  @CreateDateColumn()
  createDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @ManyToMany(() => User, (user) => user.clothes, { onDelete: "CASCADE" })
  users!: User[];

  static findByUserId(id: number) {
    return this.createQueryBuilder("clothes")
      .innerJoin("clothes.users", "user")
      .where("user.id = :id", { id })
      .getMany();
  }
}

// this.createQueryBuilder("clothes")
// .innerJoin("clothes.users", "user")
// .where("user.kakaoId = :kakaoId", { kakaoId })
// .getMany()
// .then((clothesList) => {
//   console.log("#### all", clothesList);
//   console.log("#### selected", selectedClothesList);
//   return resolve(
//     map(
//       clothesList,
//       (clothes) =>
//         ({
//           ...clothes,
//           isSelected: includes(
//             map(
//               selectedClothesList,
//               (selectedClothes) => selectedClothes.id
//             ),
//             clothes.id
//           ),
//         } as Clothes & {
//           isSelected: boolean;
//         })
//     )
//   );
// });
