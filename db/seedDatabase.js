import { processCsv, normalizeRow } from "./parseCsv.js";
import { 
    getAllBrands, 
    getAllCategories, 
    insertBrand, 
    insertCategory, 
    insertItem,
    getAllDiscTypes,
    insertDiscType
} from "./queries.js";
import { createTables } from "./createTables.js";
import { deleteTables } from "./deleteTables.js";


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
        const brands = await getAllBrands();
        const brandsMap = new Map();
        brands.forEach((row) => {
            brandsMap.set(row.brand, row.id);
        })

        const categories = await getAllCategories();
        const categoriesMap = new Map();
        categories.forEach((row) => {
            categoriesMap.set(row.category, row.id);
        });

        const disc_types = await getAllDiscTypes();
        const disc_typeMap = new Map();
        disc_types.forEach((row) => {
            row.disc_type = row.disc_type ? row.disc_type : null;
            disc_typeMap.set(row.disc_type, row.id);
        });

        console.log("Reading Data")
        for (const row of data) {
            let nRow = normalizeRow(row);
            if (brandsMap.has(nRow.brand)) {
                nRow.brand = brandsMap.get(nRow.brand);
            }else {
                // insert brand into table
                // set brand to foreign key
                const brandId = await insertBrand(nRow.brand);
                brandsMap.set(nRow.brand, brandId);
                nRow.brand = brandId;
            }
            if (categoriesMap.has(nRow.category)) {
                nRow.category = categoriesMap.get(nRow.category);
            }else {
                // insert brand into table
                // set category as foreign key
                const categoryId = await insertCategory(nRow.category);
                categoriesMap.set(nRow.category, categoryId);
                nRow.category = categoryId;
            }
            if (disc_typeMap.has(nRow.disc_type)) {
                nRow.disc_type = disc_typeMap.get(nRow.disc_type);
            }else if (nRow.disc_type === "") {
                nRow.disc_type = null;
            }else {
                const disc_typeId = await insertDiscType(nRow.disc_type);
                disc_typeMap.set(nRow.disc_type, disc_typeId);
                nRow.disc_type = disc_typeId;
            }
            nRow.description = nRow.description === "" ? null : nRow.description;
            nRow.price = nRow.price === "" ? null : Number(nRow.price);
            nRow.quantity = nRow.quantity === "" ? null : Number(nRow.quantity);

            await insertItem(nRow);
            // does this need to be await
            // then after data is all parsed insert into items table
        }
        console.log("seeding successful");
    }catch(error) {
        console.error("Seed Data Error:", error);
    }
    console.timeEnd("Timer")
};

// const data = await processCsv();
// seedData(data);


export {
    seedData
}