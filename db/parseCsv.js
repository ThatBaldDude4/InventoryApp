import fs from "node:fs";
import { parse } from "csv-parse";

// converts csv data into an array of objects
async function processCsv() {
    const parsedData = [];
    const parser = fs.createReadStream('./db/discData.csv').pipe(
        parse({ columns: true, skip_empty_lines: true })
    );

    try {
        for await (const row of parser) {
        // Processes rows sequentially
        parsedData.push(normalizeRow(row));
        }
        console.log('all rows finished.');
        return parsedData;
    } catch (err) {
        console.error('An error occurred during iteration:', err);
    }
    
}

function normalizeRow(row) {
    row.brandName = row.brand;
    row.brand = row.brand.replace(/\s+/g, '').toLowerCase();
    row.disc_type = row.disc_type?.replace(/\s+/g, '').toLowerCase();
    row.category = row.category.replace(/\s+/g, '').slice(0, 200).toLowerCase();
    return row;
}

export {
    processCsv,
    normalizeRow
}