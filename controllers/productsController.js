import { getItemFromId, updateItem, insertItem, deleteItem } from "../db/queries.js";
import { body, matchedData, validationResult } from "express-validator";
import { normalizeItems } from "../db/normalizeItemForDb.js";


try {
    process.loadEnvFile();
}catch {
    // no env file
}
const adminPassword = process.env.adminPassword;

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
        .isLength({min:0, max: 255})
        .optional()
        .withMessage("Max size reached"),
    body("brand")
        .notEmpty()
        .withMessage(`Brand ${requiredError}`),
    body("category")
        .notEmpty()
        .withMessage(`Category ${requiredError}`),
    body("quantity")
        .isInt({min: 0})
        .withMessage(`Quantity ${numberError}`),
    body("price")
        .isFloat({min: 0})
        .withMessage(`Price ${priceError}`),
    body("disc_type")
        .optional()
]

const itemValidation = [
    body("password")
        .equals(adminPassword)
        .withMessage("Incorrect Password")
]

const getProductController = async (req, res) => {
    const id = Number(req.params?.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        const error = new Error("Invalid product ID");
        error.status = 400;
        throw error;
    }


    const rows = await getItemFromId(id);

    if (rows.length === 0) {
        const error = new Error("Item not found");
        error.status = 404;
        throw error;
    }
    res.render("itemPage", {rows})
}

const getProductFormController = async (req, res) => {
    const id = Number(req.params?.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        const error = new Error("Invalid product ID");
        error.status = 400;
        throw error;
    }

    const rows = await getItemFromId(id);

    if (rows.length === 0) {
        const error = new Error("Item not found");
        error.status = 404;
        throw error;
    }
    res.render("itemForm", {rows: rows[0]});
}

const postProductController = [
    validateItem,
    itemValidation,
    async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        if (!errors.isEmpty()) {
            return res.status(400).render("itemForm", {
                errors: errors.array(),
                rows: {...req.body, id},
            })
        }
        
        const {item, description, brand, category, quantity, price, disc_type} = matchedData(req);
        const [nItem] = await normalizeItems([{id, item, description, brand, category, quantity, price, disc_type}]);
        await updateItem(nItem);
        res.redirect(`/products/${id}`)
    }
];

const getNewProductController = (req, res) => {
    res.render("itemForm", {rows: null, category: req.query?.category})
};

const postNewProduct = [
    validateItem,
    itemValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("itemForm", {
                errors: errors.array(),
                rows: {...req.body},
                category: req.query?.category,
            });
        };

        const {item, description, brand, category, quantity, price, disc_type} = matchedData(req);
        const [nItem] = await normalizeItems([{item, description, brand, category, quantity, price, disc_type}]);
        // insert item
        // grab item id
        const newItemId = await insertItem(nItem);
        res.redirect(`/products/${newItemId}`)
    }
]

const postDeleteProductController = [
    itemValidation,
    async (req, res) => {
        const id = req.params?.id;
        const {password} = matchedData(req);
        if (!password || !id) {
            res.redirect(req.get("Referrer") || "/");
            return;
        }
        await deleteItem(id);
        res.redirect(req.get("Referrer") || "/");
    }
]


export {
    getProductController,
    getProductFormController,
    postProductController,
    getNewProductController,
    postNewProduct,
    postDeleteProductController
}