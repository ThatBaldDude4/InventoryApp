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
    getProductController
}