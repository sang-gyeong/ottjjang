import * as express from "express";
import { addCard, deleteCard, editCard, reorderCard } from "./controller";

const route = express.Router();

route.post("/", addCard);
route.put("/:id", editCard);
route.delete("/:id", deleteCard);
route.put("/reorder/:id", reorderCard);

export default route;

// route.get("/", getClothesListByUserId);
// route.post("/", addClothesItem);
// route.post("/status", saveClothesStatus);
// route.delete("/", deleteClothesItem);
