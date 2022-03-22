import * as express from "express";
import {
  getClothesListByUserId,
  addClothesItem,
  deleteClothesItem,
  saveClothesStatus,
} from "./controller";

const route = express.Router();

route.get("/", getClothesListByUserId);
route.post("/", addClothesItem);
route.post("/status", saveClothesStatus);
route.delete("/", deleteClothesItem);

export default route;
