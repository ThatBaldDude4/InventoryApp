import { Router } from "express";
const indexRouter = Router();

import { getCategories } from "../controllers/indexController.js";

indexRouter.get("/", getCategories);

indexRouter.get("/home", (req, res) => {
    res.send("<h1>Home page</h1>")
});

export default indexRouter;