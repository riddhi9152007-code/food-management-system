import userModel from "../model/userModel.js";

const mockCarts = {};

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!global.isDBConnected) {
            const uid = userId || "mock-user";
            if (!mockCarts[uid]) mockCarts[uid] = {};
            mockCarts[uid][itemId] = (mockCarts[uid][itemId] || 0) + 1;
            return res.json({ success: true, message: "Added To Cart (Offline Mode)" });
        }
        if (!userId) {
            return res.json({ success: false, message: "User ID missing" });
        }
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        let cartData = userData.cartData || {};
        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.error("Add to Cart Error:", error.message);
        res.json({ success: false, message: "Error adding to cart" });
    }
}

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!global.isDBConnected) {
            const uid = userId || "mock-user";
            if (mockCarts[uid] && mockCarts[uid][itemId] > 0) {
                mockCarts[uid][itemId] -= 1;
            }
            return res.json({ success: true, message: "Removed From Cart (Offline Mode)" });
        }
        if (!userId) {
            return res.json({ success: false, message: "User ID missing" });
        }
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        let cartData = userData.cartData || {};
        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.error("Remove from Cart Error:", error.message);
        res.json({ success: false, message: "Error removing from cart" });
    }
}

// Get user cart data
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!global.isDBConnected) {
            const uid = userId || "mock-user";
            return res.json({ success: true, cartData: mockCarts[uid] || {} });
        }
        if (!userId) {
            return res.json({ success: false, message: "User ID missing" });
        }
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Get Cart Error:", error.message);
        res.json({ success: false, message: "Error fetching cart" });
    }
}

export { addToCart, removeFromCart, getCart };
