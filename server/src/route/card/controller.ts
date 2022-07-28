import { Request, Response, NextFunction } from "express";
import { toNumber } from "lodash";
import * as cardService from "../../services/card";
import * as listService from "../../services/list";

const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const cards = await cardService.getCards();

    console.log("cards : ", cards);

    if (!cards) return res.status(404).json({ message: "Cards Not Found" });
    return res.status(200).json({ success: true, data: cards });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const editCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const body = req.body;

    console.log(id, body);

    if (!id)
      return res.status(400).json({ message: "Parameter Error: List Id" });

    const isSuccess = listService.editList(id, body);
    if (!isSuccess) return res.status(404).json({ message: "List Not Found" });
    return res.json({ success: true, data: id }).status(204).end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const reorderCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const body = req.body;

    console.log(id, body);

    if (!id)
      return res.status(400).json({ message: "Parameter Error: List Id" });

    const isSuccess = listService.reorderList(id, body);
    if (!isSuccess) return res.status(404).json({ message: "List Not Found" });
    return res.json({ success: true, data: id }).status(204).end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "Parameter Error: List Id" });

    const isSuccess = listService.deleteList(id);
    if (!isSuccess) return res.status(404).json({ message: "List Not Found" });
    return res.json({ success: true, data: id }).status(204).end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const addCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const body = req.body;

    console.log("body : ", body);

    if (!body) {
      return res.status(400).json({ message: "Parameter Error: No Body" });
    }

    const { listId, cardId, pos } = await cardService.addCard(body);

    if (!listId) return res.status(404).json({ message: "List Not Found" });

    return res
      .json({ success: true, data: { listId, cardId, pos } })
      .status(204)
      .end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export { getCards, addCard, deleteCard, editCard, reorderCard };
