import { deleteCategory, getAllCategories, getItemsFromCategory, insertCategory, editCategory } from "../db/queries.js";
import { body, matchedData, validationResult } from "express-validator";
import { normalizeCategory } from "../db/normalizeItemForDb.js";

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

const newCategoryValidation = [
    body("password")
        .equals(adminPassword)
        .withMessage("Incorrect Password"),
    body("newCategory")
        .isLength({min:1, max:255})
        .withMessage("Category name must be between 1 and 255 characters long")
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
    if (category === undefined || category === "") {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
    }

    const rows = await getItemsFromCategory(category);
    res.render("home", {rows, category})
}

const getAddCategoryController = (req, res) => {
    res.render("categoryForm")
}


const postAddCategoryController = [
    newCategoryValidation,
    
    async (req, res, next) => {
        // validate user input
        const errors = validationResult(req);
        let category = req.body?.newCategory;
        if (!errors.isEmpty()) {
            res.render("categoryForm", {rows: {category}, errors: errors.array()})
            return;
        }

        // insert new category if validation is passed
        try {
            let nCategory = normalizeCategory(category);
            await insertCategory(nCategory);
        }catch(error) {
            if (error.code === "23505") {
                res.render("categoryForm", {rows: {category}, errors: [{msg: "Category already exists"}]})
                return;
            }
            return next(error);
        }


        res.redirect("/")
    }
];

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
    async (req, res, next) => {
        const form = "edit";
        const errors = validationResult(req);
        const queryString = errorsToQueryString(errors.array(), form);
        const {category, updated_category_input} = matchedData(req);
        if (!errors.isEmpty()) {
            res.redirect(queryString);
            return;
        };
        try {
            await editCategory(category, updated_category_input)
        }catch(error) {
            if (error.code === "23505") {
                const qryString = "/?error=Category%20name%20already%20used" + "&form=" + form;
                res.redirect(qryString);
                return;
            }
            return next(error);
        }
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