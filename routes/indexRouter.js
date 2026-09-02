import { Router } from "express";
const indexRouter = Router();

import { getCategoriesController, getHomeController } from "../controllers/indexController.js";

indexRouter.get("/", getCategoriesController);

indexRouter.get("/home", getHomeController);

export default indexRouter;