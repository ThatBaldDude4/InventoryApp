import { getAllCategories, getItemsFromCategory, insertCategory } from "../db/queries.js";

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

export {
    getCategoriesController,
    getHomeController,
    getAddCategoryController,
    postAddCategoryController
}