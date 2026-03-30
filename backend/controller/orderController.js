import orderModel from "../model/orderModel.js";
import userModel from "../model/userModel.js";

const mockOrders = [
    {
        _id: 'ORD_MOCK_001',
        userId: 'usr_mock_1',
        userName: 'Mock User',
        items: [{ name: 'Margherita Pizza', qty: 2, price: 299 }],
        amount: 647,
        status: 'Delivered',
        date: '2026-02-24',
        address: '123 Mock Street, Silicon Valley'
    }
];

// Placing user order
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, userName } = req.body;

        if (!global.isDBConnected) {
            const newOrder = {
                _id: 'ORD_MOCK_' + Date.now(),
                userId: userId || 'mock-user',
                userName: userName || 'Mock User',
                items: items,
                amount: amount,
                address: address,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            };
            mockOrders.push(newOrder);
            console.log("📦 Order placed in offline mode:", newOrder._id);
            return res.json({ success: true, message: "Order Placed (Offline Mode)" });
        }

        if (!userId) {
            return res.json({ success: false, message: "User ID missing" });
        }

        const newOrder = new orderModel({
            userId,
            userName: userName || "Unknown User",
            items,
            amount,
            address
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error("Place Order Error:", error.message);
        res.json({ success: false, message: "Error placing order" });
    }
}

// User orders for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!global.isDBConnected) {
            const uid = userId || 'mock-user';
            const orders = mockOrders.filter(o => o.userId === uid || o.userId === 'usr_mock_1');
            return res.json({ success: true, data: orders });
        }
        if (!userId) {
            return res.json({ success: false, message: "User ID missing" });
        }
        const orders = await orderModel.find({ userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("User Orders Error:", error.message);
        res.json({ success: false, message: "Error fetching orders" });
    }
}

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        if (!global.isDBConnected) {
            return res.json({ success: true, data: mockOrders });
        }
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("List Orders Error:", error.message);
        res.json({ success: false, message: "Error listing orders" });
    }
}

// Updating order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!global.isDBConnected) {
            const order = mockOrders.find(o => o._id === orderId);
            if (order) order.status = status;
            return res.json({ success: true, message: "Status Updated (Offline Mode)" });
        }
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error("Update Status Error:", error.message);
        res.json({ success: false, message: "Error updating status" });
    }
}

export { placeOrder, userOrders, listOrders, updateStatus };
