import { getItemFromId, updateItem, insertItem, deleteItem } from "../db/queries.js";
import { body, matchedData, validationResult } from "express-validator";
import { normalizeItems } from "../db/normalizeItemForDb.js";


try {
    process.loadEnvFile();
}catch {
    // no env file
}
const {adminPassword} = process.env.adminPassword;

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
        .withMessage(`Brand ${requiredError}`),
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

const itemValidation = [
    body("password")
        .equals(adminPassword)
        .withMessage("Incorrect Password")
]

const getProductController = async (req, res) => {
    const id = Number(req.params?.id);
    const rows = await getItemFromId(id)
    res.render("itemPage", {rows})
}

const getProductFormController = async (req, res) => {
    const id = Number(req.params?.id);
    const rows = await getItemFromId(id);
    // form should take single item
    res.render("itemForm", {rows: rows[0]});
}

const postProductController = [
    validateItem,
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
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("itemForm", {
                errors: errors.array(),
                rows: {...req.body},
            });
        };

        const {item, description, brand, category, quantity, price, disc_type} = matchedData(req);
        const [nItem] = await normalizeItems([{item, description, brand, category, quantity, price, disc_type}]);
        // insert item
        // grab item id
        const newItemId = await insertItem(nItem);
        console.log(newItemId)
        res.redirect(`/products/${newItemId}`)
    }
]

const postDeleteProductController = [
    itemValidation,
    async (req, res) => {
        const id = req.params?.id;
        const password = req.body?.password;
        console.log(id, "id")
        if (!password || !id) {
            console.log("No password/id for item");
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