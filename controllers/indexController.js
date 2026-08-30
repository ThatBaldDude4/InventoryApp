import { getAllCategories } from "../db/queries.js";

// These are controllers for processing requests for index routes

const getCategories = async (req, res) => {
    try {
        const rows = await getAllCategories();
        res.render("categories", {rows});
    } catch (err) {
        console.error(err);
        // could res.render(error ejs page)
    }
};

export {
    getCategories
}