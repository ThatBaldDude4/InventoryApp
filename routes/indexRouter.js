import { Router } from "express";
const indexRouter = Router();

import { 
    getCategoriesController, 
    getHomeController, 
    getAddCategoryController, 
    postAddCategoryController, 
    postDeleteCategoryController,
    postEditCategoryController 
} from "../controllers/indexController.js";

indexRouter.get("/", getCategoriesController);

indexRouter.get("/home", getHomeController);

indexRouter.get("/home/category/new", getAddCategoryController);

indexRouter.post("/home/category/new", postAddCategoryController);

indexRouter.post("/home/category/delete", postDeleteCategoryController);

indexRouter.post("/home/category/edit", postEditCategoryController);

export default indexRouter;