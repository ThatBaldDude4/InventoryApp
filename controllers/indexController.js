import { deleteCategory, getAllCategories, getItemsFromCategory, insertCategory } from "../db/queries.js";
import { body, matchedData, validationResult } from "express-validator";
const password = "adminPassword"

// form validation
const validation = [
    body("password")
        .equals(password)
        .withMessage("Incorrect Password"),
    body("category")
        .isLength({min:1, max: 255})
        .withMessage("Must choose category"),
]

// These are controllers for processing requests for index routes

const getCategoriesController = async (req, res) => {
    try {
        const rows = await getAllCategories();
        res.render("categories", {rows});
    } catch (err) {
        console.error(err);
        // could res.render(error ejs page)
    }
};

const getHomeController = async (req, res) => {
    try {
        const category = req.query?.category;
        console.log(category);
        const rows = await getItemsFromCategory(category);
        res.render("home", {rows, category})
    }catch (err) {
        console.error(err);
    }
}

const getAddCategoryController = (req, res) => {
    res.render("categoryForm")
}

const postAddCategoryController = async (req, res) => {
    try {
        let category = req.body?.category;
        if (category) {
            await insertCategory(category);
        }
        res.redirect("/")
    }catch(err) {
        console.error(err);
    }
}

const postDeleteCategoryController = [
    validation,
    async (req, res) => {
    try {
        const {password, category} = matchedData(req);
        if (!password || !category) {
            res.redirect("/");
            return;
        };
        await deleteCategory(category);
        res.redirect("/");
    }catch(error) {
        console.error("Error happened in postdeleteCategory you better check it out :)", error)
    }
}
]

export {
    getCategoriesController,
    getHomeController,
    getAddCategoryController,
    postAddCategoryController,
    postDeleteCategoryController
}