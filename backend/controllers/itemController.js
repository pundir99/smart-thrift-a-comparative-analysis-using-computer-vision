import ItemModel from "../models/itemModel.js";
import fs from "fs"
import { getRecommendations } from "../services/recommenderService.js"

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

// get recommended items for a specific item using ML model
const getRecommendedItems = async (req, res) => {
    try {
        const itemId = req.params.id;
        
        // Get the item from database
        const item = await ItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({success: false, message: "Item not found"});
        }
        
        // Construct full image URL
        const baseUrl = process.env.SELF_BASE_URL || "http://localhost:4000";
        const imageUrl = `${baseUrl}/images/${item.image}`;
        
        // Get recommendations from ML service
        const recommendations = await getRecommendations(imageUrl, 5);
        
        if (recommendations.length === 0) {
            // Fallback: return items from same category if ML service fails
            console.log("ML service returned no results, using category fallback");
            const similarItems = await ItemModel.find({
                category: item.category,
                _id: { $ne: itemId }
            }).limit(5);
            
            return res.json({
                success: true,
                data: similarItems,
                message: "Recommendations based on category (ML service unavailable)"
            });
        }
        
        // Extract filenames from recommendations and try to map to database items
        // Note: The ML model returns file paths from the training dataset
        // We'll try to match them with database items by filename
        
        const recommendedItems = [];
        const recommendedFilenames = recommendations.map(rec => {
            // Extract just the filename from the full path
            const filename = rec.filename.split('/').pop().split('\\').pop().toLowerCase();
            return { filename, similarity: rec.similarity_score, original: rec.filename };
        });
        
        // Try to find matching items in database by image filename
        for (const recFile of recommendedFilenames) {
            // Search for items whose image filename matches
            const matchingItem = await ItemModel.findOne({
                image: { $regex: recFile.filename.replace(/\.(jpg|jpeg|png|bmp)$/i, ''), $options: 'i' }
            });
            
            if (matchingItem && !recommendedItems.find(item => item._id.toString() === matchingItem._id.toString())) {
                recommendedItems.push(matchingItem);
            }
            
            // Limit to 5 items
            if (recommendedItems.length >= 5) break;
        }
        
        // If we didn't find enough matches, fill with category-based items
        if (recommendedItems.length < 5) {
            const categoryItems = await ItemModel.find({
                category: item.category,
                _id: { $ne: itemId, $nin: recommendedItems.map(i => i._id) }
            }).limit(5 - recommendedItems.length);
            
            recommendedItems.push(...categoryItems);
        }
        
        res.json({
            success: true,
            data: recommendedItems.slice(0, 5),
            ml_recommendations: recommendations // Include for debugging
        });
        
    } catch (error) {
        console.error("Error getting recommended items:", error);
        
        // Fallback to category-based recommendations
        try {
            const item = await ItemModel.findById(req.params.id);
            if (item) {
                const similarItems = await ItemModel.find({
                    category: item.category,
                    _id: { $ne: req.params.id }
                }).limit(5);
                
                return res.json({
                    success: true,
                    data: similarItems,
                    message: "Recommendations based on category (ML error occurred)"
                });
            }
        } catch (fallbackError) {
            console.error("Fallback also failed:", fallbackError);
        }
        
        res.status(500).json({success: false, message: "Error getting recommendations"});
    }
};

export {addItem, listItem, removeItem, getRecommendedItems};

