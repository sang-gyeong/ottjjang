import { authenticateWithJwt, IJwtPayload } from "./../../middlewares/auth";
import { IdentityStore } from "aws-sdk";
import { Request, Response, NextFunction } from "express";
import { toNumber } from "lodash";
import * as listService from "../../services/list";
import * as cardService from "../../services/card";

const getLists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const lists = await listService.getLists();

    console.log("lists : ", lists);

    if (!lists) return res.status(404).json({ message: "Lists Not Found" });
    return res.status(200).json({ success: true, data: lists });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const getListsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { kakaoId } = req.user as IJwtPayload;
    const lists = await listService.getListsByUserId(kakaoId);

    res.status(200).json({ success: true, data: lists });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getListByListId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // try {
  //   const { id } = req.params;
  //   const list = await listService.getListByListId(parseInt(id, 10));
  //   if (!list) return res.status(404).json({ message: "List Not Found" });
  //   return res.status(200).json({ success: true, data: artist });
  // } catch (err) {
  //   console.error(err);
  //   return next(err);
  // }
};

const editList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { kakaoId } = req.user as IJwtPayload;
    const { id } = req.params;
    const body = req.body;

    console.log(id, body);

    if (!id)
      return res.status(400).json({ message: "Parameter Error: List Id" });

    const isSuccess = listService.editList(kakaoId, id, body);
    if (!isSuccess) return res.status(404).json({ message: "List Not Found" });
    return res.json({ success: true, data: id }).status(204).end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const reorderList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { kakaoId } = req.user as IJwtPayload;
    const { id } = req.params;
    const body = req.body;

    console.log(id, body);

    if (!id)
      return res.status(400).json({ message: "Parameter Error: List Id" });

    const isSuccess = listService.reorderList(kakaoId, id, body);
    if (!isSuccess) return res.status(404).json({ message: "List Not Found" });
    return res.json({ success: true, data: id }).status(204).end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const deleteList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { kakaoId } = req.user as IJwtPayload;
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "Parameter Error: List Id" });

    const isSuccess = listService.deleteList(kakaoId, id);
    if (!isSuccess) return res.status(404).json({ message: "List Not Found" });
    return res.json({ success: true, data: id }).status(204).end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const addList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { kakaoId } = req.user as IJwtPayload;
    const body = req.body;

    console.log("body : ", body);

    if (!body) {
      return res.status(400).json({ message: "Parameter Error: No Body" });
    }

    const { listId, pos } = await listService.addList(kakaoId, body);

    // if (!listId) return res.status(404).json({ message: "List Not Found" });

    return res.json({ success: true, data: { listId, pos } }).status(204).end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const addListWithCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { kakaoId } = req.user as IJwtPayload;
    const body = req.body;

    console.log("body : ", body);

    if (!body) {
      return res.status(400).json({ message: "Parameter Error: No Body" });
    }

    const {
      listId,
      pos: listPos,
      title,
    } = await listService.addList(kakaoId, {
      color: body.color,
      title: "Untitled",
    });
    const {
      cardId,
      pos: cardPos,
      content,
    } = await cardService.copy({
      cardId: body.cardId,
      listId: listId,
    });

    if (!listId) return res.status(404).json({ message: "List Not Found" });
    if (!cardId) return res.status(404).json({ message: "Card Not Found" });

    return res
      .json({
        success: true,
        data: {
          list: { listId, pos: listPos, title },
          card: { cardId, pos: cardPos, content },
        },
      })
      .status(204)
      .end();
  } catch (err) {
    console.log(err);
    console.error(err);
    return next(err);
  }
};

export {
  getLists,
  getListByListId,
  addList,
  deleteList,
  editList,
  reorderList,
  addListWithCard,
  getListsByUserId,
};
