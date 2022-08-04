import * as express from "express";
import {
  getLists,
  getListByListId,
  addList,
  deleteList,
  editList,
  addListWithCard,
  reorderList,
  getListsByUserId,
} from "./controller";

const route = express.Router();

route.get("/", getListsByUserId);
route.get("/:id", getListByListId);
route.post("/", addList);
route.post("/copy", addListWithCard);
route.put("/:id", editList);
route.delete("/:id", deleteList);
route.put("/reorder/:id", reorderList);

export default route;

// route.get("/", getClothesListByUserId);
// route.post("/", addClothesItem);
// route.post("/status", saveClothesStatus);
// route.delete("/", deleteClothesItem);
