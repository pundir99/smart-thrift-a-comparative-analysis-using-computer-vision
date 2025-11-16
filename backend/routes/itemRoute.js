import express from "express" 
import {addItem, listItem, removeItem, getRecommendedItems} from "../controllers/itemController.js"
import multer from "multer"

const itemRouter = express.Router();

// storing the images for item product using multer pakcage.
const storage = multer.diskStorage({
    destination: "uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage})

itemRouter.post("/add",upload.single("image"),addItem);
itemRouter.get("/list", listItem);
itemRouter.post("/remove",removeItem);
itemRouter.get("/:id/recommendations", getRecommendedItems);

export default itemRouter;

