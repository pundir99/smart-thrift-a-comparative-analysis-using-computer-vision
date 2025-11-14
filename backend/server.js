import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import itemRouter from "./routes/itemRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config"
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

// database connection
connectDB();

// item endpoints
app.use("/api/item",itemRouter)
app.use("/images", express.static("uploads"))        // we can access the image by this statement.
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/",(req,res) => {
    res.send("API working.");
})

app.listen(port, () => {
    console.log(`server running at port: http://localhost:${port}`);
})