import { Client } from "pg";

// load and extract .env file
try {
    process.loadEnvFile();
} catch {
    // No .env file
}

const {HOST, PASSWORD, USER, DATABASE, PGPORT} = process.env;

// MSG_URL expect to be full connectionStr typically supplied from a PaaS
const connectionString = process.env.MSG_URL || `postgresql://${USER}:${PASSWORD}@${HOST}:${PGPORT}/${DATABASE}`

const ITEMS_SQL = `
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        item VARCHAR(255),
        brand_id INTEGER REFERENCES brands(id),
        disc_type_id INTEGER REFERENCES disc_type(id),
        category_id INTEGER REFERENCES categories(id),
        quantity INTEGER,
        price NUMERIC(10, 2),
        description VARCHAR(255)
    );
`;

const DISC_TYPE_SQL = `
    CREATE TABLE IF NOT EXISTS disc_type (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        disc_type VARCHAR(255) UNIQUE
    );
`;

const BRAND_SQL = `
    CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        brand VARCHAR(255) UNIQUE
    );
`;

const CATEGORIES_SQL = `
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        category VARCHAR(255) UNIQUE
    );
`;

async function createTables() {
    console.log("creating tables...");
    const client = new Client({
        connectionString: connectionString,
    });
    await client.connect();
    await client.query(DISC_TYPE_SQL);
    await client.query(BRAND_SQL);
    await client.query(CATEGORIES_SQL);
    await client.query(ITEMS_SQL);
    await client.end();
    console.log("done");
};

export {
    createTables
}