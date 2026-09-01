import pool from "./pool.js";

async function deleteTables() {
    const SQL = `
        DROP TABLE IF EXISTS items;
        DROP TABLE IF EXISTS categories;
        DROP TABLE IF EXISTS brands;
        DROP TABLE IF EXISTS disc_type;
    `;
    console.log("Deleting tables...")
    await pool.query(SQL);
    console.log("Done")
}

export {
    deleteTables
}