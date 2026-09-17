import { deleteCategory, getAllCategories, getItemsFromCategory, insertCategory, editCategory } from "../db/queries.js";
import { body, matchedData, validationResult } from "express-validator";

try {
    process.loadEnvFile();
}catch {
    // no env file
}
const adminPassword = process.env.adminPassword;

// form validation
const validation = [
    body("password")
        .equals(adminPassword)
        .withMessage("Incorrect Password"),
    body("category")
        .isLength({min:1, max: 255})
        .withMessage("Must choose a category"),
];

const editValidation = [
    body("updated_category_input")
        .isLength({min:1, max: 255})
        .withMessage("New name must be between 1 - 255 characters") 
]

// These are controllers for processing requests for index routes

const getCategoriesController = async (req, res) => {
    const rows = await getAllCategories();
    let errors = req.query?.error;
    if (typeof errors === "string") {
        errors = [errors];
    }
    const form = req.query?.form;
    console.log(form)
    res.render("categories", {rows, errors, form});
};

const getHomeController = async (req, res) => {
    const category = req.query?.category;
    const rows = await getItemsFromCategory(category);
    res.render("home", {rows, category})
}

const getAddCategoryController = (req, res) => {
    res.render("categoryForm")
}

const postAddCategoryController = async (req, res) => {
    let category = req.body?.category;
    if (category) {
        await insertCategory(category);
    }
    res.redirect("/")
}

const postDeleteCategoryController = [
    validation,
    async (req, res) => {
        const errors = validationResult(req);
        const queryString = errorsToQueryString(errors.array(), "delete");
        const {category} = matchedData(req);

        if (!errors.isEmpty()) {
            res.status(400).redirect(queryString);
            return;
        };
        await deleteCategory(category);
        res.redirect("/");
    }
];

const postEditCategoryController = [
    validation,
    editValidation,
    async (req, res) => {
        const errors = validationResult(req);
        const queryString = errorsToQueryString(errors.array(), "edit");
        const {category, updated_category_input} = matchedData(req);
        if (!errors.isEmpty()) {
            res.status(400).redirect(queryString);
            return;
        };
        await editCategory(category, updated_category_input)
        res.redirect("/");
    }
]

// need to wire string -> query -> messages

function errorsToQueryString(errors, formName) {
    if (errors.length === 0) {
        return "/";
    }
    let query = "/";

    for (let i = 0; i < errors.length; i++) {
        let error = errors[i];
        let normalizedMsg = error.msg.replaceAll(' ', "%20");
        if (i === 0) {
            query += '?error=' + normalizedMsg;
            continue;
        }
        query += '&error=' + normalizedMsg;
    };
    query += "&form=" + formName;
    return query;
}

export {
    getCategoriesController,
    getHomeController,
    getAddCategoryController,
    postAddCategoryController,
    postDeleteCategoryController,
    postEditCategoryController
}