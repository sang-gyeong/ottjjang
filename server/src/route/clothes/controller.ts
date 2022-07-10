import { Request, Response, NextFunction } from "express";
import { toNumber } from "lodash";
import { IJwtPayload } from "../../middlewares/auth";
import * as clothesService from "../../services/clothes";

const getClothesListByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.user as IJwtPayload;
    const clothesList = await clothesService.getClothesListByUserId(id);

    res.status(200).json({ success: true, data: clothesList });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const addClothesItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { kakaoId } = req.user as IJwtPayload;
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ message: "Parameter Error: Clotheskey" });
    }

    const { id } = await clothesService.addClothesItem(kakaoId, key);

    // if (!isSuccess)
    //   return res.status(404).json({ message: "Clothes Not Found" });
    return res.status(200).json({ id, key });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const deleteClothesItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { kakaoId } = req.user as IJwtPayload;
    const { id } = req.query;

    if (!id)
      return res.status(400).json({ message: "Parameter Error: Clotheskey" });

    const isSuccess = clothesService.deleteClothesItem(kakaoId, toNumber(id));
    if (!isSuccess)
      return res.status(404).json({ message: "Clothes Not Found" });
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const saveClothesStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { kakaoId } = req.user as IJwtPayload;
    const body = req.body;

    if (!body) {
      return res.status(400).json({ message: "Parameter Error: No Body" });
    }

    const isSuccess = clothesService.saveClothesStatus(kakaoId, body);

    if (!isSuccess)
      return res.status(404).json({ message: "Clothes Not Found" });
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export {
  getClothesListByUserId,
  addClothesItem,
  deleteClothesItem,
  saveClothesStatus,
};
