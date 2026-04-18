import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Package, CheckCircle, Clock, Truck, 
    XCircle, ChevronDown, ChevronUp, ArrowLeft, 
    Search, ShoppingBag, Star, MoreHorizontal,
    Box, FileText, Check, Settings
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
    { label: "Order Placed", desc: "We have received your order", icon: <FileText size={18} />, color: "bg-orange-500", key: "Pending" },
    { label: "Order Confirmed", desc: "We has been confirmed", icon: <Check size={18} />, color: "bg-orange-500", key: "Confirmed" },
    { label: "Order Processed", desc: "We are preparing your order", icon: <Settings size={18} />, color: "bg-green-500", key: "Processing" },
    { label: "Ready to Ship", desc: "Your order is ready for shipping", icon: <Box size={18} />, color: "bg-gray-300", key: "Shipping" },
    { label: "Out for Delivery", desc: "Your order is Out for Delivery", icon: <Truck size={18} />, color: "bg-gray-300", key: "Out for Delivery" }
];

const MOCK_IMAGES = {
    "Kiwi": "https://images.unsplash.com/photo-1585059895324-582b42e56abd?w=100&q=80",
    "Apple": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=100&q=80",
    "Tomato": "https://images.unsplash.com/photo-1518977676601-b53f02bad655?w=100&q=80",
    "Lime": "https://images.unsplash.com/photo-1591438676302-58ee23b375fc?w=100&q=80"
};

export default function Orders() {
    const { token, url, foodList } = useStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
            if (response.data.success && response.data.data.length > 0) {
                setOrders(response.data.data.reverse());
                setSelectedOrder(response.data.data[0]);
            } else {
                // Fallback Mock Data for Report Screenshots
                const mockOrders = [
                    { _id: "660A1D99012", date: "20-Dec-2024", total: 180, status: "Delivered", items: [{ name: "Buddha Nourish Bowl", price: 18, qty: 10 }], address: "123 Foodie Street, NY" },
                    { _id: "660B2C62123", date: "21-Dec-2024", total: 250, status: "Out for Delivery", items: [{ name: "Grilled Paneer Special", price: 25, qty: 10 }], address: "456 Gourmet Lane, CA" },
                    { _id: "660C5D55122", date: "22-Dec-2024", total: 220, status: "Processing", items: [{ name: "Mediterranean Zest", price: 22, qty: 10 }], address: "789 Tasty Road, TX" },
                    { _id: "770D4E44520", date: "23-Dec-2024", total: 190, status: "Confirmed", items: [{ name: "Quinoa Power Salad", price: 19, qty: 10 }], address: "321 Healthy Ave, FL" }
                ];
                setOrders(mockOrders);
                setSelectedOrder(mockOrders[0]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    const getStatusIndex = (status) => {
        if (status === "Delivered") return 5;
        if (status === "Out for Delivery") return 4;
        if (status === "Processing") return 2;
        return 1;
    };

    const getItemImage = (name) => {
        for (let key in MOCK_IMAGES) {
            if (name.includes(key)) return MOCK_IMAGES[key];
        }
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80";
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
        <div className="animate-pulse text-orange-500 font-black">LOADING ORDERS...</div>
    </div>;

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col pt-10 px-6">
                <div className="flex items-center justify-between mb-10">
                    <button onClick={() => navigate(-1)} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-black">My Orders</h1>
                    <div className="flex gap-2">
                        <Search size={22} className="text-gray-400" />
                        <ShoppingBag size={22} className="text-gray-400" />
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                    <Package className="w-20 h-20 mb-4" />
                    <h2 className="text-xl font-bold">No orders found</h2>
                    <p className="mt-2">Start eating something great!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['Outfit',sans-serif] selection:bg-orange-500 selection:text-white pb-10">
            <div className="max-w-6xl mx-auto px-4 lg:grid lg:grid-cols-2 lg:gap-10 pt-10">
                
                {/* Left Side: Order List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm"><ArrowLeft size={20} /></button>
                        <h1 className="text-2xl font-black text-gray-800 dark:text-white">My Orders</h1>
                        <div className="flex gap-4">
                            <Search size={22} className="text-gray-400 cursor-pointer" />
                            <Link to="/cart"><ShoppingBag size={22} className="text-gray-400 cursor-pointer" /></Link>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {orders.map((order) => (
                            <motion.div 
                                key={order._id}
                                onClick={() => setSelectedOrder(order)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-6 rounded-[32px] cursor-pointer transition-all ${selectedOrder?._id === order._id ? 'bg-white dark:bg-slate-900 shadow-xl border-l-8 border-orange-500' : 'bg-gray-100/50 dark:bg-slate-900/50 grayscale hover:grayscale-0 opacity-80 hover:opacity-100'}`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-inner overflow-hidden flex-shrink-0">
                                        <img src={getItemImage(order.items[0]?.name || "")} className="w-full h-full object-contain" alt="food" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-gray-800 dark:text-gray-100">Order#: {order._id.slice(-6).toUpperCase()}</h3>
                                        <p className="text-xs font-bold text-gray-400 mt-0.5">{order.date}, 3:00 PM</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-green-500">
                                                {order.status === "Delivered" ? `Delivered on ${order.date}` : `Estimated Delivery on ${order.date}`}
                                            </p>
                                            <div className="flex gap-0.5">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={10} className={`${s <= 4 ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Order Tracking (Visible on Mobile as Modal/Full, Desktop as Side) */}
                <AnimatePresence mode='wait'>
                    {selectedOrder && (
                        <motion.div 
                            key={selectedOrder._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="hidden lg:block bg-white dark:bg-slate-900 rounded-[50px] shadow-2xl p-10 mt-2 sticky top-24 h-fit"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black">Track Orders</h2>
                                <div className="flex gap-4">
                                    <Search size={22} className="text-gray-400" />
                                    <ShoppingBag size={22} className="text-gray-400" />
                                </div>
                            </div>

                            <div className="mb-10 space-y-2">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order ID: {selectedOrder._id}</p>
                                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white dark:bg-slate-700 p-2 rounded-2xl shadow-sm">
                                            <img src={getItemImage(selectedOrder.items[0]?.name || "")} className="w-full h-full object-contain" alt="item" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg">{selectedOrder.items[0]?.name}</h4>
                                            <p className="text-gray-400 font-bold">Rs.{selectedOrder.total}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-gray-300" />)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-xl">Track Order</h4>
                                    <ChevronUp size={24} className="text-orange-500" />
                                </div>

                                <div className="relative pl-12 space-y-12">
                                    {/* Vertical Line */}
                                    <div className="absolute left-6 top-4 bottom-4 w-1 bg-gray-100 dark:bg-slate-800" />
                                    <div className="absolute left-6 top-4 w-1 bg-gradient-to-b from-orange-500 to-green-500" style={{ height: `${(getStatusIndex(selectedOrder.status) / 5) * 100}%` }} />

                                    {STEPS.map((step, idx) => {
                                        const isCompleted = getStatusIndex(selectedOrder.status) > idx;
                                        const isCurrent = getStatusIndex(selectedOrder.status) === idx + 1;
                                        return (
                                            <div key={idx} className="relative">
                                                {/* Step Dot */}
                                                <div className={`absolute -left-12 top-0 w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg text-white transition-all scale-100 ${isCompleted || isCurrent ? step.color : 'bg-gray-100 dark:bg-slate-800 text-gray-400 shadow-none'}`}>
                                                    {step.icon}
                                                </div>
                                                <div>
                                                    <h5 className={`font-black text-lg ${isCompleted || isCurrent ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>{step.label}</h5>
                                                    <p className="text-sm font-medium text-gray-400">{step.desc}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">on {selectedOrder.date}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

