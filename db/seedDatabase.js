import { processCsv } from "./parseCsv.js";
import { insertItem } from "./queries.js";
import { createTables } from "./createTables.js";
import { deleteTables } from "./deleteTables.js";
import { normalizeItems } from "./normalizeItemForDb.js";


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
    console.timeEnd("Timer")
};

const data = await processCsv();
seedData(data);


export {
    seedData
}