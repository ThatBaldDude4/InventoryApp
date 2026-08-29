import pool from "../db/pool.js";

const getCategories = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM disc_type;');
        res.render("categories", {rows});
    } catch (err) {
        console.error(err);
        // could res.render(error ejs page)
    }
};

export {
    getCategories
}