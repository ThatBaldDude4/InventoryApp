import { getAllBrands, getAllCategories, getAllDiscTypes } from "./queries.js";
import { normalizeRow } from "./parseCsv.js";

async function dbMaps() {
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

    return {
        brandsMap,
        categoriesMap,
        disc_typeMap
    };
};

// function is very similar to seedDatabase
// might refactor functions to avoid duplication
async function normalizeItem(item) {
    const {brandsMap, categoriesMap, disc_typeMap} = await dbMaps(item);

    let nRow = normalizeRow(item);
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
    // disc_type is optional so it needs to cover undefined/null
    if (disc_typeMap.has(nRow.disc_type)) {
        nRow.disc_type = disc_typeMap.get(nRow.disc_type);
    }else if (nRow.disc_type === "" || !nRow.disc_type) {
        nRow.disc_type = null;
    }else {
        const disc_typeId = await insertDiscType(nRow.disc_type);
        disc_typeMap.set(nRow.disc_type, disc_typeId);
        nRow.disc_type = disc_typeId;
    }
    nRow.description = nRow.description === "" ? null : nRow.description;
    nRow.price = nRow.price === "" ? null : Number(nRow.price);
    nRow.quantity = nRow.quantity === "" ? null : Number(nRow.quantity);

    return nRow;
}

export {
    normalizeItem
}