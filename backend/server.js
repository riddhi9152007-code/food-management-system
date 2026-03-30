import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";

dns.setServers(['8.8.8.8', '8.8.4.4']);
import userRouter from "./router/userRouter.js";
import foodRouter from "./router/foodRouter.js";
import orderRouter from "./router/orderRouter.js";
import cartRouter from "./router/cartRouter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

global.isDBConnected = false;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        global.isDBConnected = true;
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch((err) => {
        global.isDBConnected = false;
        console.log("⚠️ DB Connection Failed - Using Mock Data Fallback");
        console.error("Reason:", err.message);
    });

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/images", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
