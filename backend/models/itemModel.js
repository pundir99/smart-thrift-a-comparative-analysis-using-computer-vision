import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    category: {type: String, required: true},
});

const ItemModel = mongoose.models.items || mongoose.model("items", itemSchema);

export default ItemModel;

