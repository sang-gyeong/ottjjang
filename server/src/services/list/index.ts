import List from "../../entities/List";
import { createRandom } from "../../utils";

const getLists = (): Promise<List[]> => {
  return List.createQueryBuilder("list").orderBy("pos", "ASC").getMany();
  // return List.createQueryBuilder("list")
  //   .leftJoinAndSelect("list.cards", "cards")
  //   .orderBy("cards.pos", "ASC")
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

const addList = async ({
  title,
  color,
}: {
  title: string;
  color: string;
}): Promise<any> => {
  try {
    const lists = await getLists();
    const list = new List();

    const id = createRandom();
    let pos = 0;

    list.id = id;
    list.title = title;
    list.color = color;

    if (!lists.length) {
      pos = 65535;
    } else {
      const length = lists.length;
      pos = lists[length - 1].pos + 65536;
    }

    list.pos = pos;

    await list.save();

    return { listId: id, pos };
  } catch (e) {
    return false;
  }
};

const deleteList = async (id: string): Promise<boolean> => {
  const listToRemove = (await List.findOne({ id })) as List;
  if (!listToRemove) return false;

  listToRemove.cards.forEach((card) => card.remove());

  await List.delete({ id });
  return true;
};

const editList = async (
  id: string,
  { title, color }: { title: string; color: string }
): Promise<boolean> => {
  const list = (await List.findOne({ id })) as List;

  console.log("list : ", list);

  if (!list) return false;

  list.title = title;
  list.color = color;

  await list.save();
  return true;
};

const reorderList = async (
  id: string,
  { pos }: { pos: number }
): Promise<boolean> => {
  const list = (await List.findOne({ id })) as List;

  console.log("list : ", list);

  if (!list) return false;

  list.pos = pos;

  await list.save();
  return true;
};

export {
  getLists,
  getListByListId,
  deleteList,
  addList,
  editList,
  reorderList,
};
