import { getItemFromId, updateItem } from "../db/queries.js";
import { body, matchedData, validationResult } from "express-validator";
import { normalizeItem } from "../db/normalizeItemForDb.js";


const lengthErr = "must be between 1 and 255 characters.";
const requiredError = "is required";
const priceError = "must be a decimal ex. 9.99";
const numberError = "must be a number"

const validateItem = [
    body("item")
        .isLength({min:1, max:255})
        .escape()
        .withMessage(`Item ${lengthErr}`),
    body("description")
        .optional(),
    body("brand")
        .notEmpty()
        .withMessage(`Category ${requiredError}`),
    body("category")
        .notEmpty()
        .withMessage(`Category ${requiredError}`),
    body("quantity")
        .isInt()
        .withMessage(`Quantity ${numberError}`),
    body("price")
        .isFloat()
        .withMessage(`Price ${priceError}`),
    body("disc_type")
        .optional()
]

const getProductController = async (req, res) => {
    try {
        const id = Number(req.params?.id);
        const rows = await getItemFromId(id)
        res.render("itemPage", {rows})
    }catch (err) {
        console.error(err);
    }
}

const getProductFormController = async (req, res) => {
    try {
        const id = Number(req.params?.id);
        const rows = await getItemFromId(id);
        // form should take single item
        res.render("itemForm", {rows: rows[0]});
    }catch(err) {
        
    }
}

const postProductController = [
    validateItem,
    async (req, res, next) => {
        const errors = validationResult(req);
        const id = req.params.id;
        if (!errors.isEmpty()) {
            // if error grab original data
            // rerender form
            const rows = await getItemFromId(id)
            return res.status(400).render("itemForm", {
                errors: errors.array(),
                rows: rows,
            })
        }
        try {
            
            const {item, description, brand, category, quantity, price, disc_type} = matchedData(req);
            const nItem = await normalizeItem({id, item, description, brand, category, quantity, price, disc_type});
            await updateItem(nItem);
            res.redirect(`/products/${id}`)
            // update data
            //redirect to
        }catch(err) {
            console.error(err);
        }
    }
]

export {
    getProductController,
    getProductFormController,
    postProductController
}