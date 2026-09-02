import { getItemFromId } from "../db/queries.js";

const getProductController = async (req, res) => {
    try {
        const id = Number(req.params?.id);
        const rows = await getItemFromId(id)
        res.render("itemPage", {rows})
    }catch (err) {
        console.error(err);
    }
}

const getProductFormController = async (req, res) => {
    try {
        const id = Number(req.params?.id);
        const rows = await getItemFromId(id);
        console.log(rows);
        // form should take single item
        res.render("itemForm", {rows: rows[0]});
    }catch(err) {
        
    }
}

const postProductController = async (req, res) => {
    try {
        const id = req.query.id;
        const {brand, disc_type, category, quantity, price, description} = req.body;
        // add some sort of validation
    }catch(err) {
        console.error(err);
    }
}

export {
    getProductController,
    getProductFormController
}