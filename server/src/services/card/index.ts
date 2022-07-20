import Card from "../../entities/Card";
import List from "../../entities/List";
import { createRandom } from "../../utils";

const addCard = async ({
  listId,
  content,
}: {
  listId: string;
  content: string;
}): Promise<any> => {
  try {
    const list = (await List.findOne(
      { id: listId },
      { relations: ["cards"] }
    )) as List;
    const cards = list.cards;
    const length = cards.length;

    if (!list) return false;

    const card = new Card();
    const id = createRandom();

    let pos = 0;
    card.id = id;
    card.content = content;

    if (!length) {
      pos = 65535;
    } else {
      pos = cards[length - 1].pos + 65536;
    }
    card.pos = pos;

    list.cards.push(card);
    await list.save();
    return { listId, cardId: id, pos };
  } catch (e) {
    return false;
  }
};

const deleteCard = async (id: string): Promise<boolean> => {
  // const listToRemove = (await List.findOne({ id })) as List;
  // if (!listToRemove) return false;
  // await List.delete({ id });
  return true;
};

const editCard = async (
  id: string,
  { title, color }: { title: string; color: string }
): Promise<boolean> => {
  // const list = (await Card.findOne({ id })) as Card;

  // console.log("list : ", list);

  // if (!list) return false;

  // list.title = title;
  // list.color = color;

  // await list.save();
  return true;
};

const reorderCard = async (
  id: string,
  { pos }: { pos: number }
): Promise<boolean> => {
  // const list = (await List.findOne({ id })) as List;

  // console.log("list : ", list);

  // if (!list) return false;

  // list.pos = pos;

  // await list.save();
  return true;
};

export { deleteCard, addCard, editCard, reorderCard };
