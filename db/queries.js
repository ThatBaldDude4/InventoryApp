import pool from "./pool.js";

async function getItemsFromCategory(category) {
    if (category === "null"){category = null};
    if (category) {
        let SQL = `
        SELECT * FROM items AS i
        WHERE i.category_id IN (
            SELECT c.id FROM categories AS c
            WHERE c.category = $1
        );
    `;
        let { rows } = await pool.query(SQL, [category]);
        return rows;
    }

    if (category === null) {
        let SQL = `
            SELECT * FROM items AS i
            WHERE i.category_id IS NULL;
            
        `;
        let { rows } = await pool.query(SQL);
        return rows;
    }
}

async function getItemFromId(id) {
    const SQL = `
        SELECT 
            brands.brand AS brand, 
            disc_type.disc_type AS disc_type,
            categories.category AS category,
            i.item,
            i.price,
            i.description,
            i.id,
            i.quantity
        FROM items as i
        LEFT JOIN brands
            ON i.brand_id = brands.id
        LEFT JOIN disc_type
            ON i.disc_type_id = disc_type.id
        LEFT JOIN categories
            ON i.category_id = categories.id
        WHERE i.id = $1;
        
    `;
    const { rows } = await pool.query(SQL, [id])
    return rows;
};

async function updateItem({id, brand, disc_type, category, item, quantity, price, description}) {
    const SQL = `
        UPDATE items AS i
        SET 
            item = $2, 
            brand_id = $3, 
            disc_type_id = $4, 
            category_id = $5,
            quantity = $6,
            price = $7,
            description = $8
        WHERE i.id = $1;
    `;
    await pool.query(SQL, [id, item, brand, disc_type, category, quantity, price, description]);
}

async function getAllBrands() {
    const { rows } = await pool.query('SELECT * FROM brands;');
    return rows;
}

async function insertBrand(brand) {
    let {rows} = await pool.query('INSERT INTO brands (brand) VALUES ($1) RETURNING id;', [brand]);
    return rows[0].id;
}

async function getAllCategories() {
    const { rows } = await pool.query('SELECT * FROM categories;');
    return rows;
}

async function insertCategory(category) {
    let {rows} = await pool.query('INSERT INTO categories (category) VALUES ($1) RETURNING id;', [category]);
    return rows[0].id;
}

async function deleteCategory(category) {
    await pool.query('DELETE FROM categories WHERE category = $1', [category]);
}

async function insertItem(item) {
    const SQL = `
        INSERT INTO items (item, brand_id, disc_type_id, category_id, quantity, price, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `;
    let {rows} = await pool.query(SQL, [item.item, item.brand, item.disc_type, item.category, item.quantity, item.price, item.description])
    return rows[0].id;
}

async function getAllDiscTypes() {
    let { rows } = await pool.query(`SELECT * FROM disc_type;`);
    return rows;
}

async function insertDiscType(type) {
    let {rows} = await pool.query(`INSERT INTO disc_type (disc_type) VALUES ($1) RETURNING id;`, [type]);
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
    insertDiscType,
    getItemFromId,
    updateItem,
    deleteCategory
}