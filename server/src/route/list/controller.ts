import { Request, Response, NextFunction } from "express";
import * as listService from "../../services/list";

const getLists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const lists = await listService.getLists();
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

export { getLists, getListByListId };
