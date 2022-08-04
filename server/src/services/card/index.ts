import Card from "../../entities/Card";
import List from "../../entities/List";
import User from "../../entities/User";
import { createRandom } from "../../utils";

const getCards = (): Promise<Card[]> => {
  return Card.createQueryBuilder("card").orderBy("pos", "ASC").getMany();
  // return List.createQueryBuilder("list")
  //   .leftJoinAndSelect("list.cards", "cards")
  //   .orderBy("cards.pos", "ASC")
  //   .getMany();
};

const getCardsByUserId = async (id: number): Promise<any> => {
  const user = (await User.findOne(
    { id },
    {
      relations: ["cards"],
    }
  )) as User;

  const cards = user.cards;
  console.log(cards);

  return cards;
};

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

    const cardToAdd = new Card();
    const id = createRandom();

    let pos = 0;
    cardToAdd.id = id;
    cardToAdd.listId = listId;
    cardToAdd.content = content;

    if (!length) {
      pos = 65535;
    } else {
      pos = cards[length - 1].pos + 65536;
    }
    cardToAdd.pos = pos;

    await cardToAdd.save();

    list.cards.push(cardToAdd as Card);
    console.log("=list : ", list);
    await list.save();
    return { listId, cardId: id, pos };
  } catch (e) {
    return false;
  }
};

const copy = async ({
  listId,
  cardId,
}: {
  listId: string;
  cardId: string;
}): Promise<any> => {
  try {
    const list = (await List.findOne(
      { id: listId },
      { relations: ["cards"] }
    )) as List;

    console.log("list", list);

    const originalCard = (await Card.findOne({ id: cardId })) as Card;

    if (!list || !originalCard) return false;

    const cards = list.cards;
    const length = cards.length;
    const content = `copy of ${originalCard.content}`;

    const cardToAdd = new Card();
    const newCardId = createRandom();

    let pos = 0;
    cardToAdd.id = newCardId;
    cardToAdd.listId = listId;
    cardToAdd.content = content;

    if (!length) {
      pos = 65535;
    } else {
      pos = cards[length - 1].pos + 65536;
    }
    cardToAdd.pos = pos;

    await cardToAdd.save();

    list.cards.push(cardToAdd as Card);
    console.log("=list : ", list);
    await list.save();
    return { listId, cardId: newCardId, pos, content };

    // const originalCard = (await Card.findOne({ id: cardId })) as Card;

    // console.log("originalCard : ", originalCard);

    // if (!originalCard) return false;

    // const cardToAdd = new Card();
    // const newCardId = createRandom();

    // let pos = 0;
    // cardToAdd.id = newCardId;
    // cardToAdd.listId = listId;
    // cardToAdd.content = `copy of ${originalCard.content}`;
    // cardToAdd.pos = 65535;

    // await cardToAdd.save();
    // return { listId, cardId: newCardId, pos };
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

export {
  getCards,
  deleteCard,
  getCardsByUserId,
  addCard,
  editCard,
  reorderCard,
  copy,
};
