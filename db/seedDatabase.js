import { processCsv } from "./parseCsv";
import { getAllBrands, getAllCategories } from "./queries";

async function seedDatabase() {
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
            categoriesMap.set(row.brand, row.id);
        });


        for (const row of data) {
            let brandId;
            let categoryId;
            if (brandsMap.has(row.brand)) {
                brandId = brandsMap.get(row.brand);
            }else {
                // insert brand into table
                // get new row id and set brandId to it
            }
            if (categoriesMap.has(row.category)) {
                categoryId = categoriesMap.get(row.category);
            }else {
                // insert brand into table
                // get new row id and set categoryId to it
            }

            // then after data is all parsed insert into items table
        }
    }catch(error) {
        console.error("Seed Data Error:", error);
    }
}