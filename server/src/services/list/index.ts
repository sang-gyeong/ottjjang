import List from "../../entities/List";

const getLists = (): Promise<List[]> => {
  return List.find();
  // return List.createQueryBuilder("mag")
  //   .leftJoinAndSelect("mag.tracks", "track")
  //   .leftJoinAndSelect("track.album", "album")
  //   .leftJoinAndSelect("track.artists", "artist")
  //   .getMany();
};

const getListByListId = (listId: string): Promise<List | undefined> => {
  return List.createQueryBuilder("mag")
    .leftJoinAndSelect("mag.tracks", "track")
    .leftJoinAndSelect("track.album", "album")
    .leftJoinAndSelect("track.artists", "artist")
    .where("mag.id = :magazineId", { listId })
    .getOne();
};

export { getLists, getListByListId };
