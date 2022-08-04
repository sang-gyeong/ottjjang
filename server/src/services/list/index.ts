import { includes, map } from "lodash";
import List from "../../entities/List";
import User from "../../entities/User";
import { createRandom } from "../../utils";

const getLists = (): Promise<List[]> => {
  return List.createQueryBuilder("list").orderBy("pos", "ASC").getMany();
  // return List.createQueryBuilder("list")
  //   .leftJoinAndSelect("list.cards", "cards")
  //   .orderBy("cards.pos", "ASC")
  //   .getMany();
};

const getListsByUserId = async (kakaoId: string): Promise<any> => {
  const user = (await User.findOne(
    { kakaoId },
    {
      relations: ["lists"],
    }
  )) as User;

  const lists = user.lists;
  console.log(lists);

  return lists;
};

const getListByListId = (listId: string): Promise<List | undefined> => {
  return List.createQueryBuilder("mag")
    .leftJoinAndSelect("mag.tracks", "track")
    .leftJoinAndSelect("track.album", "album")
    .leftJoinAndSelect("track.artists", "artist")
    .where("mag.id = :magazineId", { listId })
    .getOne();
};

const addList = async (
  kakaoId: string,
  {
    title,
    color,
  }: {
    title: string;
    color: string;
  }
): Promise<any> => {
  try {
    const user = (await User.findOne(
      { kakaoId },
      {
        relations: ["lists"],
      }
    )) as User;

    const lists = await getLists();
    const listToAdd = new List();

    const id = createRandom();
    let pos = 0;

    listToAdd.id = id;
    listToAdd.title = title;
    listToAdd.color = color;

    if (!lists.length) {
      pos = 65535;
    } else {
      const length = lists.length;
      pos = lists[length - 1].pos + 65536;
    }

    listToAdd.pos = pos;

    await listToAdd.save();

    user.lists.push(listToAdd as List);
    await user.save();

    return { listId: id, pos, title };
  } catch (e) {
    return false;
  }
};

const deleteList = async (kakaoId: string, id: string): Promise<boolean> => {
  const user = (await User.findOne(
    { kakaoId },
    { relations: ["lists"] }
  )) as User;

  const listToRemove = (await List.findOne({ id })) as List;
  if (!listToRemove) return false;

  user.lists = user.lists.filter((list) => list.id !== listToRemove.id);

  await user.save();

  await List.delete({ id });
  return true;
};

const editList = async (
  kakaoId: string,
  id: string,
  { title, color }: { title: string; color: string }
): Promise<boolean> => {
  const user = (await User.findOne(
    { kakaoId },
    { relations: ["lists"] }
  )) as User;

  const listToEdit = (await List.findOne({ id })) as List;

  console.log("list : ", listToEdit);

  if (!listToEdit) return false;

  listToEdit.title = title;
  listToEdit.color = color;

  user.lists.map((list) =>
    list.id === listToEdit.id ? { ...list, title, color } : list
  );

  await listToEdit.save();
  await user.save();
  return true;
};

const reorderList = async (
  kakaoId: string,
  id: string,
  { pos }: { pos: number }
): Promise<boolean> => {
  const user = (await User.findOne(
    { kakaoId },
    { relations: ["lists"] }
  )) as User;

  const listToReorder = (await List.findOne({ id })) as List;

  console.log("listToReorder : ", listToReorder);

  if (!listToReorder) return false;

  listToReorder.pos = pos;

  await listToReorder.save();

  user.lists.map((list) =>
    list.id === listToReorder.id ? { ...list, pos } : list
  );

  await listToReorder.save();
  await user.save();

  return true;
};

export {
  getLists,
  getListByListId,
  deleteList,
  addList,
  editList,
  reorderList,
  getListsByUserId,
};
