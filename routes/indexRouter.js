import { Router } from "express";
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
    res.send("<h1>Select Category page</h1>");
});

indexRouter.get("/home", (req, res) => {
    res.send("<h1>Home page</h1>")
});

export default indexRouter;