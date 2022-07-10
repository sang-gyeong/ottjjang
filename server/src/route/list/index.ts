import * as express from "express";
import {
  getLists,
  getListByListId,
  addList,
  deleteList,
  editList,
} from "./controller";

const route = express.Router();

route.get("/", getLists);
route.get("/:id", getListByListId);
route.post("/", addList);
route.put("/:id", editList);
route.delete("/:id", deleteList);

export default route;

// route.get("/", getClothesListByUserId);
// route.post("/", addClothesItem);
// route.post("/status", saveClothesStatus);
// route.delete("/", deleteClothesItem);
