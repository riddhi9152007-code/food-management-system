import foodModel from "../model/foodModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");

// In-memory store for foods added when DB is offline
if (!global.localFoods) global.localFoods = [];

// Scan uploads folder and return all image filenames not already in localFoods
const getUploadedImages = () => {
    try {
        const files = fs.readdirSync(uploadsDir);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
        const trackedImages = new Set(global.localFoods.map(f => f.image));
        return imageFiles.filter(f => !trackedImages.has(f));
    } catch {
        return [];
    }
};

// Add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    // If DB is connected, save to database
    if (global.isDBConnected) {
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: image_filename
        });
        try {
            await food.save();
            return res.json({ success: true, message: "Food Added" });
        } catch (error) {
            console.log(error);
            return res.json({ success: false, message: "Error saving to DB" });
        }
    }

    // DB is offline – store in memory so it shows up immediately
    const newFood = {
        _id: `local_${Date.now()}`,
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        category: req.body.category,
        image: image_filename,
        rating: 4.5,
        reviews: 0
    };
    global.localFoods.push(newFood);
    console.log(`📦 Food saved in memory (DB offline): ${newFood.name}`);
    return res.json({ success: true, message: "Food Added (saved locally)" });
}



// List all food
const listFood = async (req, res) => {
    try {
        const mockFoods = [
            { _id: '1', name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella, and basil.', price: 299, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80', rating: 4.8, reviews: 120 },
            { _id: '2', name: 'Spicy Chicken Burger', description: 'Juicy chicken patty with spicy mayo and jalapeños.', price: 199, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', rating: 4.5, reviews: 85 },
            { _id: '3', name: 'Veggie Pasta', description: 'Creamy Alfredo sauce with seasonal vegetables.', price: 249, category: 'Pasta', image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&q=80', rating: 4.6, reviews: 64 },
            { _id: '4', name: 'Greek Salad', description: 'Fresh cucumbers, tomatoes, olives, and feta cheese.', price: 179, category: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80', rating: 4.7, reviews: 42 },
            { _id: '5', name: 'Chocolate Lava Cake', description: 'Warm cake with a molten chocolate center.', price: 149, category: 'Dessert', image: 'chocolate_lava_cake.png', rating: 4.9, reviews: 210 },
            { _id: '6', name: 'Mango Lassi', description: 'Thick creamy mango lassi with saffron and pistachio.', price: 79, category: 'Beverages', image: 'mango_lassi.png', rating: 4.8, reviews: 189 },
            { _id: '7', name: 'Sushi Selection', description: 'Premium assortment of nigiri and maki rolls.', price: 599, category: 'Asian', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80', rating: 4.8, reviews: 156 },
            { _id: '8', name: 'Tikka Pav', description: 'Spiced chicken tikka stuffed in a soft pav bun.', price: 89, category: 'Indian', image: 'tikka_pav.png', rating: 4.7, reviews: 98 },
            { _id: '9', name: 'Pakodi', description: 'Crispy gram flour fritters with onions & green chili.', price: 59, category: 'Starters', image: 'pakodi.png', rating: 4.6, reviews: 134 },
            { _id: '10', name: 'Manchurian', description: 'Indo-Chinese veggie balls in a tangy, spicy dark sauce.', price: 129, category: 'Indian', image: 'manchurian.png', rating: 4.5, reviews: 76 },
            { _id: '11', name: 'Puff', description: 'Flaky golden pastry puff filled with spiced potato masala.', price: 39, category: 'Starters', image: 'puff.png', rating: 4.8, reviews: 211 },
        ];

        if (!global.isDBConnected) {
            return res.json({ success: true, data: mockFoods });
        }

        let foods = await foodModel.find({});

        // If DB is connected but empty, show mock data so UI is not empty
        if (foods.length === 0) {
            return res.json({ success: true, data: mockFoods, message: "Showing demo data as DB is empty." });
        }

        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove food item
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;

        // If it's a locally added food (DB offline), remove from memory
        if (id && id.startsWith('local_')) {
            global.localFoods = global.localFoods.filter(f => f._id !== id);
            return res.json({ success: true, message: "Food Removed (from local)" });
        }

        if (global.isDBConnected) {
            await foodModel.findByIdAndDelete(id);
        }
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addFood, listFood, removeFood };
