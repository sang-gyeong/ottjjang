import { IdentityStore } from "aws-sdk";
import { Request, Response, NextFunction } from "express";
import { toNumber } from "lodash";
import * as listService from "../../services/list";

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

const reorderList = async (req: Request, res: Response, next: NextFunction) => {
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

const deleteList = async (
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

const addList = async (
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

    const listId = listService.addList(body);

    if (!listId) return res.status(404).json({ message: "List Not Found" });

    return res.json({ success: true, data: listId }).status(204).end();
  } catch (err) {
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
};
