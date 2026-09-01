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

async function insertBrand(brand) {
    let {rows} = await pool.query('INSERT INTO brands (brand) VALUES ($1) RETURNING id', [brand]);
    return rows[0].id;
}

async function getAllCategories() {
    const { rows } = await pool.query('SELECT * FROM categories;');
    return rows;
}

async function insertCategory(category) {
    let {rows} = await pool.query('INSERT INTO categories (category) VALUES ($1) RETURNING id', [category]);
    return rows[0].id;
}

async function insertItem(item) {
    const SQL = `
        INSERT INTO items (item, brand, disc_type, category, quantity, price, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(SQL, [item.item, item.brand, item.disc_type, item.category, item.quantity, item.price, item.description])
}

async function getAllDiscTypes() {
    let { rows } = await pool.query(`SELECT * FROM disc_type`);
    return rows;
}

async function insertDiscType(type) {
    let {rows} = await pool.query(`INSERT INTO disc_type (disc_type) VALUES ($1) RETURNING id`, [type]);
    return rows[0].id;
}

export {
    getAllCategories,
    getItemsFromCategory,
    insertCategory,
    getAllBrands,
    insertBrand,
    insertItem,
    getAllDiscTypes,
    insertDiscType
}