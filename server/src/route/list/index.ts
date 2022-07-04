import * as express from "express";
import { getLists, getListByListId } from "./controller";

const route = express.Router();

route.get("/", getLists);
route.get("/:id", getListByListId);

export default route;
