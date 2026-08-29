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
        item VARCHAR(255)
    );
`;

const DISC_TYPE_SQL = `
    CREATE TABLE IF NOT EXISTS disc_type (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        disc_type VARCHAR(255) UNIQUE
    );

    INSERT INTO disc_type (disc_type)
    VALUES ('putter'), ('mid-range'), ('fairway-driver'), ('distance-driver')
    ON CONFLICT DO NOTHING;
`;

const BRAND_SQL = `
    CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        brand VARCHAR(255) UNIQUE
    );

    INSERT INTO brands (brand)
    VALUES ('Axiom Discs'), ('Discraft'), ('Latitude 64')
    ON CONFLICT DO NOTHING;
`;

async function main() {
    console.log("seeding");
    const client = new Client({
        connectionString: connectionString,
    });
    await client.connect();
    await client.query(ITEMS_SQL);
    await client.query(DISC_TYPE_SQL);
    await client.query(BRAND_SQL);
    await client.end();
    console.log("done");
};

main();