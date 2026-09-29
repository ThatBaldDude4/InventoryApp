import { processCsv } from "./parseCsv.js";
import { insertItem } from "./queries.js";
import { createTables } from "./createTables.js";
import { deleteTables } from "./deleteTables.js";
import { normalizeItems } from "./normalizeItemForDb.js";
import {fileURLToPath} from 'url';
import pool from "./pool.js";


// takes array of objects
// resets tables
// normalizes each data item
// inserts item into database
async function seedData(dat) {
    console.time("Timer");
    await deleteTables();
    await createTables();

    // copy data as to not mutate original
    const data = dat.map(row => ({ ...row }));
    try {
        const nItems = await normalizeItems(data);
        for (const item of nItems) {
            await insertItem(item);
        }
        console.log("seeding successful");
    }catch(error) {
        console.error("Seed Data Error:", error);
    }
};

export { seedData };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try {
        const data = await processCsv();
        await seedData(data);
    }finally {
        await pool.end();
        console.timeEnd("Timer")
    }
    
}