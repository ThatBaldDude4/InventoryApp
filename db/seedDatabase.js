import { processCsv } from "./parseCsv.js";
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

async function seedDatabase() {
    await deleteTables();
    await createTables();

    try {
        const data = await processCsv();

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
            disc_typeMap.set((row.disc_type, row.id));
        });

        console.log("Reading Data")
        for await (const row of data) {
            if (brandsMap.has(row.brand)) {
                row.brand = brandsMap.get(row.brand);
            }else {
                // insert brand into table
                // set brand to foreign key
                const brandId = await insertBrand(row.brand);
                brandsMap.set(row.brand, brandId);
                row.brand = brandId;
            }
            if (categoriesMap.has(row.category)) {
                row.category = categoriesMap.get(row.category);
            }else {
                // insert brand into table
                // set category as foreign key
                const categoryId = await insertCategory(row.category);
                categoriesMap.set(row.category, categoryId);
                row.category = categoryId;
            }
            if (disc_typeMap.has(row.disc_type)) {
                row.disc_type = disc_typeMap.get(row.disc_type);
            }else if (row.disc_type === "") {
                row.disc_type = null;
            }else {
                const disc_typeId = await insertDiscType(row.disc_type);
                disc_typeMap.set(row.disc_type, disc_typeId);
                row.disc_type = disc_typeId;
            }
            row.description = row.description === "" ? null : row.description;
            row.price = row.price === "" ? null : Number(row.price);
            row.quantity = row.quantity === "" ? null : Number(row.quantity);

            await insertItem(row);
            // then after data is all parsed insert into items table
        }
        console.log("seeding successful");
    }catch(error) {
        console.error("Seed Data Error:", error);
    }
};

seedDatabase();