import * as express from "express";
import sampleRoute from "./sample";
import userRoute from "./users";
import logRoute from "./log";
import authRoute from "./auth";
import auth2Route from "./auth2";
import libraryRoute from "./library";
import trackRoute from "./track";
import albumRoute from "./album";
import artistRoute from "./artist";
import clothesRoute from "./clothes";
import magRoute from "./mag";
import listRoute from "./list";
import cardRoute from "./card";
import playlistRoute from "./playlist";
import {
  authenticateWithJwt,
  tryAuthenticateWithJwt,
} from "../middlewares/auth";

const route = express.Router();

route.use("/sample", sampleRoute);
route.use("/user", userRoute);
route.use("/log", tryAuthenticateWithJwt, logRoute);
route.use("/auth", authRoute);
route.use("/auth2", auth2Route);
route.use("/library", authenticateWithJwt, libraryRoute);
route.use("/track", trackRoute);
route.use("/album", albumRoute);
route.use("/list", authenticateWithJwt, listRoute);
route.use("/card", cardRoute);
route.use("/artist", artistRoute);
route.use("/clothes", authenticateWithJwt, clothesRoute);
route.use("/main", authenticateWithJwt, userRoute);
route.use("/playlist", playlistRoute);

export default route;
