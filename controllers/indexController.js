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
        .withMessage("Must choose category"),
    body("updated_category_input")
        .isLength({min:1, max: 255})
        .withMessage("Must be between 1 - 255 characters")
];

// These are controllers for processing requests for index routes

const getCategoriesController = async (req, res) => {
    const rows = await getAllCategories();
    res.render("categories", {rows});
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

        const {password, category} = matchedData(req);
        if (!password || !category) {
            res.redirect("/");
            return;
        };
        await deleteCategory(category);
        res.redirect("/");
    }
];

const postEditCategoryController = [
    validation,
    async (req, res) => {
        const {password, category, updated_category_input} = matchedData(req);
        console.log(password, category, updated_category_input)
        if (!password || !category || !updated_category_input) {
            res.redirect("/");
            return;
        };
        await editCategory(category, updated_category_input)
        res.redirect("/");
    }
]

export {
    getCategoriesController,
    getHomeController,
    getAddCategoryController,
    postAddCategoryController,
    postDeleteCategoryController,
    postEditCategoryController
}