import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard, ShoppingBag, CheckCircle, Clock, Truck,
    XCircle, Package, TrendingUp, Users, DollarSign, Filter,
    ChevronDown, Search, RefreshCw, ArrowLeft, Plus, Image as ImageIcon, Trash2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const CATEGORIES = ['Pizza', 'Burger', 'Indian', 'Pasta', 'Grill', 'Desserts', 'Beverages', 'Starters', 'Salads'];

const STATUS_CONFIG = {
    'Pending': { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: <Clock className="w-3.5 h-3.5" /> },
    'Processing': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: <Package className="w-3.5 h-3.5" /> },
    'Out for Delivery': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', icon: <Truck className="w-3.5 h-3.5" /> },
    'Delivered': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    'Cancelled': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function AdminDashboard() {
    const { orders, updateOrderStatus, listOrders, foodList, fetchFoodList, url } = useStore();
    const [tab, setTab] = useState('orders'); // 'orders' | 'menu'
    const [statusFilter, setStatusFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Food Form State
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Pizza"
    });

    const onDataChange = (e) => setData(p => ({ ...p, [e.target.name]: e.target.value }));

    const onAddFood = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                setData({ name: "", description: "", price: "", category: "Pizza" });
                setImage(false);
                alert("Food Added!");
                await fetchFoodList();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error adding food");
        }
    }

    const onRemoveFood = async (id) => {
        if (!window.confirm("Are you sure you want to remove this item?")) return;
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id });
            if (response.data.success) {
                alert("Removed!");
                await fetchFoodList();
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        listOrders();
        fetchFoodList();
    }, []);

    // Stats
    const stats = useMemo(() => ({
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        outForDelivery: orders.filter(o => o.status === 'Out for Delivery').length,
        cancelled: orders.filter(o => o.status === 'Cancelled').length,
        revenue: orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.total || o.amount || 0), 0),
        customers: new Set(orders.map(o => o.userId)).size,
    }), [orders]);

    // Filtered Orders
    const filteredOrders = useMemo(() => {
        let list = orders;
        if (statusFilter !== 'All') list = list.filter(o => o.status === statusFilter);
        if (search) list = list.filter(o =>
            o._id.toLowerCase().includes(search.toLowerCase()) ||
            (o.userName && o.userName.toLowerCase().includes(search.toLowerCase()))
        );
        return list;
    }, [orders, statusFilter, search]);

    const statCards = [
        { label: 'Total Orders', value: stats.total, icon: <ShoppingBag className="w-5 h-5" />, color: 'from-blue-500 to-blue-600', sub: 'All time' },
        { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'from-green-500 to-green-600', sub: 'Excl. cancelled' },
        { label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'from-yellow-500 to-amber-500', sub: 'Need attention' },
        { label: 'In Transit', value: stats.outForDelivery, icon: <Truck className="w-5 h-5" />, color: 'from-orange-500 to-orange-600', sub: 'Out for delivery' },
        { label: 'Delivered', value: stats.delivered, icon: <CheckCircle className="w-5 h-5" />, color: 'from-emerald-500 to-teal-500', sub: 'Completed' },
        { label: 'Customers', value: stats.customers, icon: <Users className="w-5 h-5" />, color: 'from-purple-500 to-violet-600', sub: 'Unique users' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 fade-in">
            {/* Top Bar */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-800 dark:text-white">Admin Portal</h1>
                            <div className="flex gap-4 mt-1">
                                <button onClick={() => setTab('orders')} className={`text-xs font-bold transition-all ${tab === 'orders' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'}`}>Orders</button>
                                <button onClick={() => setTab('menu')} className={`text-xs font-bold transition-all ${tab === 'menu' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'}`}>Manage Menu</button>
                            </div>
                        </div>
                    </div>
                    <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to site
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {tab === 'orders' ? (
                    <>
                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            {statCards.map((s, i) => (
                                <div key={i} className="card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className={`bg-gradient-to-br ${s.color} p-4 text-white`}>
                                        {s.icon}
                                        <p className="text-2xl font-extrabold mt-2">{s.value}</p>
                                    </div>
                                    <div className="p-3">
                                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{s.label}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{s.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Status Overview Bar */}
                        <div className="card p-6 mb-8">
                            <h2 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-orange-500" /> Order Status Overview
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {STATUS_OPTIONS.map(status => {
                                    const cfg = STATUS_CONFIG[status];
                                    const count = orders.filter(o => o.status === status).length;
                                    const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(prev => prev === status ? 'All' : status)}
                                            className={`p-3 rounded-xl text-center transition-all border-2 ${statusFilter === status ? 'border-orange-400 shadow-md' : 'border-transparent'
                                                } ${cfg.color}`}
                                        >
                                            <div className="flex justify-center mb-1">{cfg.icon}</div>
                                            <p className="text-2xl font-extrabold">{count}</p>
                                            <p className="text-xs font-medium mt-0.5">{status}</p>
                                            <p className="text-xs opacity-60">{pct}%</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="card overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                                <h2 className="font-bold text-gray-800 dark:text-white text-lg">
                                    Recent Orders <span className="text-orange-500 ml-1">{filteredOrders.length}</span>
                                </h2>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:w-56">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search orders..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="input-field pl-10 py-2 text-sm"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={e => setStatusFilter(e.target.value)}
                                        className="input-field py-2 text-sm w-auto pr-8"
                                    >
                                        <option value="All">All Status</option>
                                        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-slate-800/50 text-left">
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Order ID</th>
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Customer</th>
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Items</th>
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Amount</th>
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Status</th>
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.length === 0 ? (
                                            <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No orders found</td></tr>
                                        ) : filteredOrders.map(order => {
                                            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
                                            return (
                                                <tr key={order._id} className="border-t border-gray-50 dark:border-slate-800">
                                                    <td className="px-5 py-4 font-mono text-xs font-bold">{order._id.slice(-8)}</td>
                                                    <td className="px-5 py-4">
                                                        <p className="font-bold">{order.userName || 'User'}</p>
                                                        <p className="text-xs text-gray-400 truncate max-w-[150px]">{order.address}</p>
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-500">{order.items?.length || 0} items</td>
                                                    <td className="px-5 py-4 font-bold text-orange-500">₹{order.total || order.amount}</td>
                                                    <td className="px-5 py-4">
                                                        <span className={`badge flex items-center gap-1 w-fit ${cfg.color}`}>
                                                            {cfg.icon} {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <select
                                                            value={order.status}
                                                            onChange={e => updateOrderStatus(order._id, e.target.value)}
                                                            className="input-field py-1 text-xs w-32"
                                                        >
                                                            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                                        </select>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* Add Food Form */}
                        <div className="lg:col-span-1 card p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-orange-500" /> Add New Item
                            </h2>
                            <form onSubmit={onAddFood} className="space-y-4">
                                <div className="flex flex-col items-center">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 w-full text-left">Upload Image</p>
                                    <label htmlFor="food-image" className="w-full h-40 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-all overflow-hidden">
                                        {image ? (
                                            <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                                                <p className="text-xs text-gray-400">Click to upload</p>
                                            </>
                                        )}
                                        <input type="file" id="food-image" hidden onChange={(e) => setImage(e.target.files[0])} required />
                                    </label>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Product Name</label>
                                    <input name="name" onChange={onDataChange} value={data.name} type="text" placeholder="Type here..." className="input-field mt-1" required />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Description</label>
                                    <textarea name="description" onChange={onDataChange} value={data.description} rows="3" placeholder="Write content here..." className="input-field mt-1 resize-none" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
                                        <select name="category" onChange={onDataChange} value={data.category} className="input-field mt-1">
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Price (₹)</label>
                                        <input name="price" onChange={onDataChange} value={data.price} type="number" placeholder="299" className="input-field mt-1" required />
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary w-full py-3 mt-4">ADD ITEM</button>
                            </form>
                        </div>

                        {/* Food List */}
                        <div className="lg:col-span-2 card overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-slate-700">
                                <h2 className="font-bold text-gray-800 dark:text-white text-lg">
                                    Menu Items <span className="text-orange-500 ml-1">{foodList.length}</span>
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-slate-800/50 text-left">
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Image</th>
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Name</th>
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Category</th>
                                            <th className="px-5 py-3 text-gray-500 font-semibold">Price</th>
                                            <th className="px-5 py-3 text-gray-500 font-semibold text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foodList.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50">
                                                <td className="px-5 py-3">
                                                    <img src={item.image.startsWith('http') ? item.image : `${url}/images/` + item.image} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                                                </td>
                                                <td className="px-5 py-3 font-semibold text-gray-800 dark:text-white">{item.name}</td>
                                                <td className="px-5 py-3">
                                                    <span className="badge bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300">{item.category}</span>
                                                </td>
                                                <td className="px-5 py-3 font-bold text-orange-500">₹{item.price}</td>
                                                <td className="px-5 py-3 text-center">
                                                    <button onClick={() => onRemoveFood(item._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
