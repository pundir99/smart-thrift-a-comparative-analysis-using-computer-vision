import ItemModel from "../models/itemModel.js";
import fs from "fs"

// add Item item
const addItem = async(req, res) => {
    let image_name = `${req.file.filename}`;    // getting the file name and saving it in image_name

    const item = new ItemModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_name,
    })

    try {
        await item.save();
        res.json({success: true, message: "item added"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "error"})
    }
}

// all item list
const listItem = async(req, res) => {
    try {
        const item = await ItemModel.find({});
        res.json({success:true, data: item});
    } catch (error) {
        console.log(error);
        res.json({success:false, message: "error"});
    }
}

// remove item item
const removeItem = async(req, res) => {
    try {
        const item = await ItemModel.findById(req.body.id);
        // console.log(item);
        fs.unlink(`uploads/${item.image}`, ()=> {})

        await ItemModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "item removed"});
    } catch (error) {
        console.log("error");
        res.json({success:false, message: "error"});
    }
}

export {addItem, listItem, removeItem};

