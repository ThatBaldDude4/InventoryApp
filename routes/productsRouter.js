import { Router } from "express";
import { 
    getProductController,
    getProductFormController,
    postProductController 
} from "../controllers/productsController.js";
const productsRouter = Router();

// need to preserve users selected category
// so that when client is redirected to home 
// page the products are the same

productsRouter.get("/:id", getProductController);

productsRouter.get("/:id/edit", getProductFormController);

productsRouter.post("/:id/edit", postProductController);

export default productsRouter;