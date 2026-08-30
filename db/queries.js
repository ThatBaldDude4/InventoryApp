import pool from "./pool.js"

async function getItemsFromCategory(category) {
    const SQL = `
        SELECT * FROM items AS i
        WHERE i.categories_id IN (
            SELECT c.id FROM categories AS c
            WHERE c.category = $1
        );
    `
    const { rows } = await pool.query(SQL);
    return rows;
}

async function getAllBrands() {
    const { rows } = await pool.query('SELECT * FROM brands;');
    return rows;
}

async function getAllCategories() {
    const { rows } = await pool.query('SELECT * FROM categories;');
    return rows;
}

export {
    getAllCategories,
    getItemsFromCategory,
    getAllBrands
}