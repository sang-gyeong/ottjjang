import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import Log from "../models/Log";

export interface IJwtPayload {
  id: number;
  nickname: string;
  profileURL: string;
  kakaoId: string;
}

export const authenticateWithJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as IJwtPayload;
    req.user = user;
    next();
  } catch (err) {
    // TODO: redirect 시킬 지 논의해보기
     res.status(200).json({ success: false, message: "Invalid Token" });
  }
};

export const tryAuthenticateWithJwt = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as IJwtPayload;
    req.user = user;
    next();
  } catch (err) {
    next();
  }
};
