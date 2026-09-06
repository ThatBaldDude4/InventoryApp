import { Router } from "express";
const indexRouter = Router();

import { getCategoriesController, getHomeController, getAddCategoryController, postAddCategoryController } from "../controllers/indexController.js";

indexRouter.get("/", getCategoriesController);

indexRouter.get("/home", getHomeController);

indexRouter.get("/home/category/new", getAddCategoryController);

indexRouter.post("/home/category/new", postAddCategoryController);

export default indexRouter;