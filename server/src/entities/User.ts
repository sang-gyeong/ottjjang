import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import MP3 from "./MP3";
import Artist from "./Artist";
import Album from "./Album";
import Track from "./Track";
import Playlist from "./Playlist";
import Subscribe from "./Subscribe";
import Clothes from "./Clothes";
import List from "./List";
import Card from "./Card";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nickname!: string;

  @Column({ unique: true })
  kakaoId!: string;

  @Column()
  profileURL!: string;

  @CreateDateColumn()
  createDate!: Date;

  @Column({
    nullable: true,
  })
  password!: string;

  @OneToMany(() => MP3, (mp3) => mp3.user, { onDelete: "CASCADE" })
  mp3!: MP3[];

  @OneToMany(() => Subscribe, (subscribe) => subscribe.user, {
    onDelete: "CASCADE",
  })
  subscribe!: Subscribe[];

  @ManyToMany(() => Artist, (artist) => artist.users, { onDelete: "CASCADE" })
  @JoinTable({ name: "UserArtist" })
  artists!: Artist[];

  @ManyToMany(() => Clothes, (clothes) => clothes.users, {
    onDelete: "CASCADE",
  })
  @JoinTable({ name: "UserClothes" })
  clothes!: Clothes[];

  @ManyToMany(() => Clothes, (clothes) => clothes.users, {
    onDelete: "CASCADE",
  })
  @JoinTable({ name: "UserSelectedClothes" })
  selectedClothes!: Clothes[];

  @ManyToMany(() => Album, (album) => album.users, { onDelete: "CASCADE" })
  @JoinTable({ name: "UserAlbum" })
  albums!: Album[];

  @ManyToMany(() => Playlist, (playlist) => playlist.users, {
    onDelete: "CASCADE",
  })
  @JoinTable({ name: "UserPlaylist" })
  playlists!: Playlist[];

  @ManyToMany(() => Track, (track) => track.users, { onDelete: "CASCADE" })
  @JoinTable({ name: "UserTrack" })
  tracks!: Track[];

  @ManyToMany(() => List, (lists) => lists.users, {
    onDelete: "CASCADE",
  })
  @JoinTable({ name: "UserList" })
  lists!: List[];

  @ManyToMany(() => Card, (cards) => cards.users, {
    onDelete: "CASCADE",
  })
  @JoinTable({ name: "UserList" })
  cards!: Card[];
}
