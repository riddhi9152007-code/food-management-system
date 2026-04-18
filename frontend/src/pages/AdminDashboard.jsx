import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard, BarChart2, BookOpen, Users, ShoppingCart, Star, 
    Briefcase, MessageSquare, Settings, Search, Bell, Menu, 
    MoreVertical, ChevronDown, MapPin, Plus, TrendingUp, TrendingDown,
    Map, Package, Edit, Lock, Unlock, Trash2, Download
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { useStore } from '../context/StoreContext';

const STATUS_CONFIG = {
    'Completed': { bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    'Processing': { bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    'Cancelled': { bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    'Pending': { bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
};

// Dummy Data for Charts
const orderRateData = [
  { name: 'Jan', value: 22000 },
  { name: 'Feb', value: 29000 },
  { name: 'Mar', value: 40000 },
  { name: 'Apr', value: 20000 },
  { name: 'May', value: 49000 },
  { name: 'Jun', value: 72108 },
  { name: 'Jul', value: 85000 },
  { name: 'Aug', value: 49000 },
  { name: 'Sep', value: 20000 },
  { name: 'Oct', value: 36000 },
  { name: 'Nov', value: 55000 },
  { name: 'Dec', value: 71000 },
];

const visitorAgeData = [
    { name: 'Age 18-30', value: 60, color: '#ff6b35' },
    { name: 'Age 30-45', value: 25, color: '#fca311' },
    { name: 'Age 45-55', value: 15, color: '#e5e5e5' },
];

const sparklineData1 = [{v:10}, {v:15}, {v:12}, {v:20}, {v:18}, {v:25}];
const sparklineData2 = [{v:25}, {v:18}, {v:20}, {v:12}, {v:15}, {v:10}];
const sparklineData3 = [{v:5}, {v:15}, {v:10}, {v:30}, {v:25}, {v:40}];
const sparklineData4 = [{v:40}, {v:25}, {v:30}, {v:10}, {v:15}, {v:5}];

export default function AdminDashboard() {
    const { orders, updateOrderStatus, listOrders, foodList, fetchFoodList, url } = useStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Dashboard');
    
    // Form States
    const [image, setImage] = useState(false);
    const [data, setData] = useState({ name: "", description: "", price: "", category: "Pizza" });
    const CATEGORIES = ['Pizza', 'Burger', 'Indian', 'Pasta', 'Grill', 'Desserts', 'Beverages', 'Starters', 'Salads'];

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
            } else alert(response.data.message);
        } catch (error) { console.error(error); alert("Error adding food"); }
    };

    const onRemoveFood = async (id) => {
        if (!window.confirm("Are you sure you want to remove this item?")) return;
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id });
            if (response.data.success) { alert("Removed!"); await fetchFoodList(); }
        } catch (error) { console.error(error); }
    };

    useEffect(() => { listOrders(); fetchFoodList(); }, []);
    
    // Derived or Mock Data for Table
    const recentOrders = useMemo(() => {
        if (orders && orders.length > 0) {
            return orders.slice(0, 5).map(o => ({
                id: `#${o._id.slice(-6)}`,
                menu: o.items?.[0]?.name || 'Food Item',
                image: o.items?.[0]?.image ? `${url}/images/${o.items[0].image}` : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80',
                customer: o.userName || 'Guest User',
                price: `$${(o.total || o.amount || 0).toFixed(2)}`,
                date: new Date(o.date || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: o.status === 'Delivered' ? 'Completed' : (o.status === 'Pending' ? 'Pending' : (o.status === 'Cancelled' ? 'Cancelled' : 'Processing'))
            }));
        }
        // Fallback dummy data closely matching the image
        return [
            { id: '#430080', menu: 'Burger with ham', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80', customer: 'Bessie Cooper', price: '$9.00', date: '02 May, 2024', status: 'Completed' },
            { id: '#430079', menu: 'Hamburger', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=100&q=80', customer: 'Floyd Miles', price: '$15.87', date: '03 Mar, 2024', status: 'Completed' },
            { id: '#430078', menu: 'Cheese Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=100&q=80', customer: 'Guy Hawkins', price: '$12.50', date: '01 Mar, 2024', status: 'Processing' },
            { id: '#430077', menu: 'Pasta dish', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=100&q=80', customer: 'Jenny Wilson', price: '$8.20', date: '28 Feb, 2024', status: 'Completed' },
        ];
    }, [orders, url]);
    
    // Combine real orders with dummy ones if needed for screenshots
    const displayOrders = useMemo(() => {
        const dummyPrefix = [
            {
                _id: "order_dummy_1",
                date: new Date(Date.now() - 86400000).toISOString(),
                status: "Pending",
                items: [
                    { name: "BBQ Chicken Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", price: 12.50, quantity: 2 },
                    { name: "Dragon Fruit Mojito", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80", price: 8.00, quantity: 1 }
                ],
                total: 33.00,
                userName: "Arjun Mehta",
                address: "Plot 42, Satellite Area, Ahmedabad, GJ"
            },
            {
                _id: "order_dummy_2",
                date: new Date(Date.now() - 172800000).toISOString(),
                status: "Delivered",
                items: [
                    { name: "Cheese Pizza Large", image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80", price: 18.00, quantity: 1 },
                    { name: "Garlic Breadsticks", image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&q=80", price: 5.50, quantity: 2 }
                ],
                total: 29.00,
                userName: "Priya Sharma",
                address: "Flat 204, Crystal Heights, Gachibowli, HYD"
            }
        ];
        
        if (orders && orders.length > 0) {
            // Keep real orders at the top, add dummies if count is low
            return orders.length < 3 ? [...orders, ...dummyPrefix.slice(0, 3 - orders.length)] : orders;
        }
        return dummyPrefix;
    }, [orders]);

    return (
        <div className="flex h-screen bg-[#f8f9fa] dark:bg-slate-900 font-sans overflow-hidden">
            
            {/* Sidebar */}
            <aside className={`w-[260px] flex-shrink-0 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 h-full flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full fixed z-20'}`}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-gray-50 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-[#ff6b35] flex items-center justify-center">
                            <span className="text-white font-black text-xl leading-none">R</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-800 dark:text-white">REDISH</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
                    <NavItem icon={<BarChart2 size={20} />} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
                    <NavItem icon={<BookOpen size={20} />} label="Menus" hasChild active={activeTab === 'Menus'} onClick={() => setActiveTab('Menus')} />
                    <NavItem icon={<Package size={20} />} label="Manage Items" active={activeTab === 'Manage Items'} onClick={() => setActiveTab('Manage Items')} />
                    <NavItem icon={<BookOpen size={20} />} label="Food Menu" active={activeTab === 'Food Menu'} onClick={() => setActiveTab('Food Menu')} />
                    <NavItem icon={<Map size={20} />} label="Categories" active={activeTab === 'Categories'} onClick={() => setActiveTab('Categories')} />
                    <NavItem icon={<Users size={20} />} label="Customers" hasChild active={activeTab === 'Customers'} onClick={() => setActiveTab('Customers')} />
                    <NavItem icon={<ShoppingCart size={20} />} label="Orders" badge="24" active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} />
                    <NavItem icon={<Star size={20} />} label="Review" hasChild active={activeTab === 'Review'} onClick={() => setActiveTab('Review')} />
                    <NavItem icon={<Briefcase size={20} />} label="Employee" hasChild active={activeTab === 'Employee'} onClick={() => setActiveTab('Employee')} />
                    <NavItem icon={<MessageSquare size={20} />} label="Message" active={activeTab === 'Message'} onClick={() => setActiveTab('Message')} />
                    <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
                </div>

                {/* Bottom Promo */}
                <div className="p-4 mt-auto">
                    <div className="bg-gradient-to-b from-orange-50 to-orange-100/50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-5 text-center relative overflow-hidden">
                        <img 
                           src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80" 
                           alt="Burger Promo" 
                           className="w-24 h-24 object-cover rounded-full mx-auto mb-3 shadow-lg border-2 border-white absolute -top-4 -right-4 opacity-30 blur-sm" 
                        />
                        <div className="relative z-10 w-16 h-16 mx-auto mb-3">
                           <img 
                               src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" 
                               alt="Burger" 
                               className="w-full h-full object-cover rounded-xl shadow-md"
                           />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 px-1">
                            Organize your menus through button bellow
                        </p>
                        <button className="w-full bg-white dark:bg-slate-900 text-[#ff6b35] font-bold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm">
                            +Add Menus
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700/50 px-6 sm:px-10 flex items-center justify-between z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden text-gray-500 hover:text-gray-800"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight hidden sm:block">
                            {activeTab}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search.." 
                                className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/20 focus:border-[#ff6b35] transition-all"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
                                <MessageSquare size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors relative">
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-700"></span>
                            </button>
                        </div>

                        <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block"></div>

                        <div className="flex items-center gap-3 cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">Riddhi Solanki</p>
                                <p className="text-xs text-gray-500 font-medium">Admin</p>
                            </div>
                            <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Playground */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
                    
                    {activeTab === 'Dashboard' && (
                        <>
                            {/* Top Section: Stats & Map */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        
                        {/* 4 Stat Cards */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <StatCard 
                                title="Menus" 
                                value="124" 
                                subtext="vs last month" 
                                icon={<BookOpen size={16} className="text-[#ff6b35]" />}
                                data={sparklineData1} color="#ff6b35"
                                onClick={() => setActiveTab('Menus')}
                            />
                            <StatCard 
                                title="Orders" 
                                value="325" 
                                subtext="vs last month" 
                                icon={<ShoppingCart size={16} className="text-emerald-500" />}
                                data={sparklineData3} color="#10b981"
                                onClick={() => setActiveTab('Orders')}
                            />
                            <StatCard 
                                title="Customers" 
                                value="2,453" 
                                subtext="vs last month" 
                                icon={<Users size={16} className="text-[#ff6b35]" />}
                                data={sparklineData2} color="#ff6b35"
                                onClick={() => setActiveTab('Customers')}
                            />
                            <StatCard 
                                title="Income" 
                                value="$11,260" 
                                subtext="vs last month" 
                                icon={<TrendingUp size={16} className="text-rose-500" />}
                                data={sparklineData4} color="#f43f5e"
                                onClick={() => setActiveTab('Analytics')}
                            />
                        </div>

                        {/* Service Area Map */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    Service area <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400 font-bold">i</span>
                                </h3>
                                <button className="p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-400"><MoreVertical size={18} /></button>
                            </div>
                            <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-100 min-h-[160px]">
                                {/* Placeholder for Map */}
                                <img src="https://i.stack.imgur.com/HILmr.png" alt="Map" className="w-full h-full object-cover grayscale opacity-70" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-[#ff6b35] rounded-full shadow-[0_0_0_4px_rgba(255,107,53,0.3)] animate-pulse"></div>
                                        <MapPin className="absolute bottom-full left-1/2 -translate-x-1/2 text-[#ff6b35] drop-shadow-md" size={32} />
                                    </div>
                                </div>
                                {/* Controls */}
                                <div className="absolute right-3 bottom-3 flex flex-col gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
                                    <button className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 border-b border-gray-50">+</button>
                                    <button className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50">-</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Charts */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                        
                        {/* Order Rate Chart */}
                        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Order Rate</h3>
                                    <p className="text-sm text-gray-500 font-medium">Order activity this year</p>
                                </div>
                                <div className="flex bg-gray-50 dark:bg-slate-900 rounded-xl p-1 border border-gray-100 dark:border-slate-700">
                                    {['Weekly', 'Monthly', 'Yearly'].map((t, i) => (
                                        <button 
                                            key={t}
                                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${t === 'Monthly' ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-64 mt-4 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={orderRateData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `${val/1000}k`} />
                                        <RechartsTooltip cursor={{ fill: 'rgba(255,107,53,0.05)' }} content={<CustomTooltip />} />
                                        <Bar 
                                            dataKey="value" 
                                            fill="#ffc8b4" 
                                            radius={[4, 4, 0, 0]}
                                            barSize={32}
                                            activeBar={<Rectangle fill="#ff6b35" />}
                                        >
                                            {orderRateData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.name === 'Jun' ? '#ff6b35' : '#ffc8b4'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Visitors Age Chart */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Visitors Age</h3>
                                <button className="p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-400"><MoreVertical size={18} /></button>
                            </div>
                            
                            <div className="flex-1 relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie
                                            data={visitorAgeData}
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={4}
                                        >
                                            {visitorAgeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xs text-gray-500 font-medium">Total</span>
                                    <span className="text-xl font-black text-gray-800 dark:text-white">100%</span>
                                </div>
                            </div>
                            
                            {/* Legend */}
                            <div className="mt-8 space-y-4">
                                {visitorAgeData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-gray-50 dark:border-slate-700/50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="font-bold text-gray-800 dark:text-white">{item.value}%</span>
                                        </div>
                                        <span className="text-gray-500 font-medium">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Bottom Section: Table */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Orders</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search customer..." 
                                    className="pl-9 pr-4 py-2 bg-transparent border border-gray-200 dark:border-slate-700 rounded-xl text-sm w-full sm:w-56 focus:outline-none focus:border-[#ff6b35] transition-all"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="text-xs font-bold tracking-wider text-gray-400 uppercase border-b border-gray-100 dark:border-slate-700/50">
                                        <th className="pb-3 px-4 first:pl-0">CODE</th>
                                        <th className="pb-3 px-4">MENU</th>
                                        <th className="pb-3 px-4">CUSTOMER NAME</th>
                                        <th className="pb-3 px-4 text-right">PRICE</th>
                                        <th className="pb-3 px-4">DATE</th>
                                        <th className="pb-3 px-4 text-right">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order, i) => (
                                        <tr key={i} className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="py-4 px-4 first:pl-0 font-semibold text-gray-800 dark:text-gray-300 text-sm">
                                                {order.id}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={order.image} alt={order.menu} className="w-10 h-10 rounded-lg object-cover shadow-sm bg-gray-100" />
                                                    <span className="font-bold text-gray-800 dark:text-white text-sm">{order.menu}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {order.customer}
                                            </td>
                                            <td className="py-4 px-4 text-sm font-bold text-gray-800 dark:text-white text-right">
                                                {order.price}
                                            </td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-500">
                                                {order.date}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${STATUS_CONFIG[order.status]?.bg || 'bg-gray-100 text-gray-600'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                        </>
                    )}

                    {activeTab === 'Menus' && (
                        <div className="space-y-8 animate-fade-in pb-12">
                            {/* Sub Header - Mimicking reference image */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-slate-800/30 p-6 rounded-[32px] border border-white dark:border-slate-700">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Hello Riddhi Solanki,</h2>
                                    <p className="text-sm text-gray-500 font-bold mt-1">Ready to expand your culinary map? 🍳</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="bg-[#ff6b35] text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#ff6b35]/20 hover:scale-105 transition-transform">Menu Guide</button>
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-gray-400 border border-gray-100 dark:border-slate-600 relative">
                                        <Bell size={18} />
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={onAddFood} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left & Center: Item Information */}
                                <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-gray-100 dark:border-slate-700 shadow-sm space-y-8">
                                    <div className="flex items-center justify-between border-b border-gray-50 dark:border-slate-700 pb-6">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Item Information</h3>
                                        <div className="flex items-center gap-2">
                                            <select className="bg-gray-50 dark:bg-slate-900 border-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:ring-0">
                                                <option>Select Language ▾</option>
                                                <option>English</option><option>Hindi</option><option>Gujarati</option>
                                            </select>
                                            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Translate</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Item Name</label>
                                            <input name="name" onChange={onDataChange} value={data.name} type="text" placeholder="e.g. Chickent Burger" className="w-full bg-gray-50/50 dark:bg-slate-900/40 border-2 border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-400/50 font-bold" required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                                            <textarea name="description" onChange={onDataChange} value={data.description} rows="4" placeholder="Write item contents here..." className="w-full bg-gray-50/50 dark:bg-slate-900/40 border-2 border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-400/50 font-medium resize-none" required />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-50 dark:border-slate-700">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Pricing & Category</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="relative">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Base Price ($)</label>
                                                <input name="price" onChange={onDataChange} value={data.price} type="number" placeholder="45.00" className="w-full bg-gray-50/50 dark:bg-slate-900/40 border-2 border-gray-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-400 font-black text-lg" required />
                                                <button type="button" className="absolute right-4 bottom-4 text-[10px] font-black text-rose-500 uppercase italic">Delete Price</button>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                                                <select name="category" onChange={onDataChange} value={data.category} className="w-full bg-gray-50/50 dark:bg-slate-900/40 border-2 border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-400 font-bold appearance-none">
                                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ingredients Grid - Reference Image Style */}
                                    <div className="pt-8 border-t border-gray-50 dark:border-slate-700">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Add Ingredients</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                {['Vegan', 'Eggs', 'Dairy', 'Pork', 'Peanuts'].map((ing, i) => (
                                                    <label key={ing} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${i < 2 ? 'border-emerald-100 bg-emerald-50 dark:bg-emerald-900/10' : 'border-gray-50 bg-white dark:bg-slate-900'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i < 2 ? 'bg-emerald-500 text-white' : 'border-2 border-gray-200'}`}>
                                                                {i < 2 && <Plus size={12} className="rotate-45" />}
                                                            </div>
                                                            <span className={`text-sm font-bold ${i < 2 ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500'}`}>{ing}</span>
                                                        </div>
                                                        <div className="w-6 h-6 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">🥗</div>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl p-6 border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-wrap gap-2 content-start">
                                                {['egg', 'peanuts', 'pork', 'vegan', 'kosher', 'tag word +'].map((tag, i) => (
                                                    <span key={tag} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${i < 4 ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Side Cards */}
                                <div className="lg:col-span-4 space-y-8">
                                    {/* Action Box */}
                                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                                        <button type="button" className="text-gray-400 font-bold text-sm flex items-center gap-2 hover:text-gray-600 transition-colors">
                                            <ChevronDown size={16} className="rotate-90" /> Back to Menu List
                                        </button>
                                        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Save Change</button>
                                    </div>

                                    {/* Pricing Options Card */}
                                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Pricing Options</h4>
                                        <div className="space-y-4">
                                            {['Price Label', 'Price Unit', 'Price Range'].map(opt => (
                                                <label key={opt} className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors">
                                                    <div className="w-5 h-5 rounded border-2 border-gray-200 dark:border-slate-700 flex-shrink-0 group-hover:border-emerald-500 transition-colors"></div>
                                                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-800 dark:group-hover:text-white transition-colors uppercase tracking-tight">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Featured Photo Card */}
                                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Featured Photo</h4>
                                        <label htmlFor="food-image-side" className="group relative block aspect-square bg-[#fff8f5] dark:bg-slate-900/50 rounded-[32px] border-4 border-dashed border-[#ffeee6] dark:border-slate-700 overflow-hidden cursor-pointer">
                                            {image ? (
                                                <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800">
                                                    <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80" alt="pizza" className="w-40 h-40 object-cover rounded-full mb-6 shadow-2xl shadow-orange-500/20" />
                                                    <p className="text-xs font-black text-[#ff6b35] uppercase tracking-widest">Add another</p>
                                                </div>
                                            )}
                                            <input type="file" id="food-image-side" hidden onChange={(e) => setImage(e.target.files[0])} />
                                        </label>
                                        <div className="mt-6 flex items-center justify-between gap-4">
                                            <input type="text" placeholder="Alt Text" className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-[10px] font-bold text-gray-400 uppercase italic" />
                                        </div>
                                    </div>
                                    
                                    {/* Bottom Illustration Card */}
                                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-2 border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                                        <img src="https://img.freepik.com/free-vector/chef-with-waiter-serving-food-restaurant_23-2148412891.jpg?w=400" alt="illus" className="w-full rounded-[24px]" />
                                    </div>
                                </div>
                            </form>

                            {/* Food List Section - Repurposed for completeness */}
                            <div className="bg-white dark:bg-slate-800 rounded-[40px] p-8 border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden mt-12">
                                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-6">Current Live Menu</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {foodList.slice(0, 4).map((item, i) => (
                                        <div key={i} className="group relative bg-gray-50 dark:bg-slate-900 p-4 rounded-[32px] border border-gray-100 dark:border-slate-800 hover:border-orange-500 transition-all">
                                            <div className="aspect-square rounded-[24px] overflow-hidden mb-4">
                                                <img src={item.image.startsWith('http') ? item.image : `${url}/images/` + item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            </div>
                                            <h5 className="font-bold text-gray-800 dark:text-white">{item.name}</h5>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[#ff6b35] font-black">${item.price}</span>
                                                <button onClick={() => onRemoveFood(item._id)} className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-gray-100 dark:border-slate-700">Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Orders' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">Active Orders Management</h2>
                                <span className="bg-[#ff6b35] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md shadow-[#ff6b35]/20">{orders.length} Active</span>
                            </div>

                            {displayOrders.length === 0 ? (
                                <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-slate-700">
                                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-bold">No active orders at the moment</p>
                                </div>
                            ) : displayOrders.map(order => (
                                <div key={order._id} className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                    {/* Order Header */}
                                    <div className="bg-orange-50/50 dark:bg-orange-900/10 px-8 py-5 border-b border-gray-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#ff6b35] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#ff6b35]/20">
                                                <ShoppingCart size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-gray-800 dark:text-white leading-none">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">{new Date(order.date || Date.now()).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${STATUS_CONFIG[order.status]?.bg || 'bg-gray-100 text-gray-600'}`}>
                                                {order.status}
                                            </div>
                                            <button className="bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">View Invoice</button>
                                        </div>
                                    </div>

                                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Order Items Section */}
                                        <div className="lg:col-span-2">
                                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Order Items</h4>
                                            <div className="space-y-3">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="bg-gray-50/50 dark:bg-slate-900/50 p-4 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-800">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 flex-shrink-0">
                                                                <img src={item.image?.startsWith('http') ? item.image : `${url}/images/` + item.image} alt="" className="w-full h-full object-cover" onError={(e)=>e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80'} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800 dark:text-white">{item.name}</p>
                                                                <p className="text-xs text-gray-400 font-bold">$ {item.price} × {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-[#ff6b35]/10 px-3 py-1.5 rounded-lg">
                                                            <p className="text-[#ff6b35] font-black text-sm">$ {(item.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Fee & Status Update Section */}
                                        <div className="space-y-6">
                                            <div className="bg-gray-50/50 dark:bg-slate-900/50 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800">
                                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Order Summary</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500 font-bold">Subtotal:</span>
                                                        <span className="text-gray-800 dark:text-white font-black">$ {(order.total || order.amount).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500 font-bold">Delivery Fee:</span>
                                                        <span className="text-emerald-500 font-black">FREE</span>
                                                    </div>
                                                    <div className="pt-3 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                                                        <span className="text-gray-800 dark:text-white font-black">Grand Total:</span>
                                                        <span className="text-2xl font-black text-[#ff6b35]">$ {(order.total || order.amount).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-6 space-y-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Change Order Status</label>
                                                        <select 
                                                            value={order.status}
                                                            onChange={e => updateOrderStatus(order._id, e.target.value)}
                                                            className="w-full bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 dark:text-white focus:outline-none focus:border-[#ff6b35]/50 transition-colors"
                                                        >
                                                            {['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                                        </select>
                                                    </div>
                                                    <button onClick={() => alert("Status Updated Successfully!")} className="w-full bg-[#ff6b35] hover:bg-[#e85a21] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#ff6b35]/20 transition-all active:scale-95 uppercase tracking-widest text-xs">Update Progress</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Details Footer */}
                                    <div className="bg-gray-50/30 dark:bg-slate-900/30 px-8 py-6 border-t border-gray-100 dark:border-slate-700">
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Customer Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Customer Name</p>
                                                <p className="font-bold text-gray-800 dark:text-white">{order.userName || "Valued Customer"}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Shipping Address</p>
                                                <p className="font-bold text-gray-800 dark:text-white text-sm leading-relaxed">{order.address}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Payment Mode</p>
                                                <p className="font-bold text-gray-800 dark:text-white">Cash / Online</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'Analytics' && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Analytics Overview</h2>
                                    <p className="text-sm text-gray-400 font-medium mt-1">Detailed performance and traffic reports</p>
                                </div>
                                <button className="bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all">Download Report</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <StatCard title="Weekly Traffic" value="+45.2%" subtext="12,450 visitors" icon={<TrendingUp size={16} className="text-[#ff6b35]" />} data={sparklineData1} color="#ff6b35" />
                                <StatCard title="Conversion Rate" value="8.4%" subtext="vs 7.2% last week" icon={<BarChart2 size={16} className="text-blue-500" />} data={sparklineData3} color="#3b82f6" />
                                <StatCard title="Avg Order Value" value="$42.50" subtext="+$2.00 increase" icon={<ShoppingCart size={16} className="text-emerald-500" />} data={sparklineData2} color="#10b981" />
                                <StatCard title="Bounce Rate" value="32.1%" subtext="-4.5% improvement" icon={<TrendingDown size={16} className="text-rose-500" />} data={sparklineData4} color="#f43f5e" />
                            </div>

                            <div className="bg-gray-50/50 dark:bg-slate-900/50 rounded-[32px] p-8 border border-gray-100 dark:border-slate-800">
                                <h3 className="text-lg font-black text-gray-800 dark:text-white mb-6">Order Activity vs Traffic</h3>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={orderRateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} />
                                            <RechartsTooltip content={<CustomTooltip />} />
                                            <Bar dataKey="value" fill="#ff6b35" radius={[6, 6, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Customers' && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
                            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Customer Database</h2>
                                <button className="text-[#ff6b35] font-bold text-sm">+ Add Customer</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                                        <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4 text-right">Total Spent</th></tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            {n: "Eleanor Pena", e: "eleanor.pena@example.com", s: "$450.00"},
                                            {n: "Jacob Jones", e: "jacob.jones@example.com", s: "$120.50"},
                                            {n: "Kristin Watson", e: "kristin.w@example.com", s: "$89.00"},
                                            {n: "Courtney Henry", e: "courtney.h@example.com", s: "$1,240.25"}
                                        ].map((c, i) => (
                                            <tr key={i} className="border-t border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                                <td className="px-6 py-4 font-bold text-gray-800 dark:text-white flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">{c.n.charAt(0)}</div>
                                                    {c.n}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{c.e}</td>
                                                <td className="px-6 py-4 font-bold text-[#ff6b35] text-right">{c.s}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Review' && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Customer Reviews</h2>
                            <div className="space-y-6">
                                {[
                                    { n: "Guy Hawkins", r: "Amazing food! The delivery was very fast and the pizza was hot.", s: 5 },
                                    { n: "Bessie Cooper", r: "The pasta could use a bit more salt, but otherwise great service.", s: 4 },
                                    { n: "Leslie Alexander", r: "Best burgers in town. Highly recommended!", s: 5 }
                                ].map((rev, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-700">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-800 dark:text-white">{rev.n}</span>
                                            <span className="flex text-yellow-400">{'★'.repeat(rev.s)}{'☆'.repeat(5-rev.s)}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">{rev.r}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Employee' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Staff Management</h2>
                                    <p className="text-sm text-gray-400 font-medium mt-1">Manage employee shifts, payroll, and roles</p>
                                </div>
                                <button className="bg-[#ff6b35] hover:bg-[#e85a21] text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#ff6b35]/20 transition-all active:scale-95 flex items-center gap-2">
                                    <Plus size={16} /> Add Employee
                                </button>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Staff', val: '5', color: 'bg-blue-500' },
                                    { label: 'On Duty', val: '3', color: 'bg-emerald-500' },
                                    { label: 'On Leave', val: '1', color: 'bg-amber-500' },
                                    { label: 'Off Duty', val: '1', color: 'bg-gray-400' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${s.color}`}></div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</span>
                                        </div>
                                        <p className="text-3xl font-black text-gray-800 dark:text-white mt-2">{s.val}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Employee Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { name: 'Arjun Patel', role: 'Head Chef', email: 'arjun.patel@foodiehub.com', phone: '+1 (555) 234-5678', shift: 'Morning (6AM - 2PM)', status: 'On Duty', statusColor: 'bg-emerald-100 text-emerald-700', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', joined: 'Jan 2024' },
                                    { name: 'Priya Sharma', role: 'Sous Chef', email: 'priya.sharma@foodiehub.com', phone: '+1 (555) 345-6789', shift: 'Morning (6AM - 2PM)', status: 'On Duty', statusColor: 'bg-emerald-100 text-emerald-700', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', joined: 'Mar 2024' },
                                    { name: 'Ravi Kumar', role: 'Line Cook', email: 'ravi.kumar@foodiehub.com', phone: '+1 (555) 456-7890', shift: 'Evening (2PM - 10PM)', status: 'On Duty', statusColor: 'bg-emerald-100 text-emerald-700', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', joined: 'Jun 2024' },
                                    { name: 'Sneha Desai', role: 'Manager', email: 'sneha.desai@foodiehub.com', phone: '+1 (555) 567-8901', shift: 'Full Day (9AM - 6PM)', status: 'On Leave', statusColor: 'bg-amber-100 text-amber-700', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', joined: 'Feb 2024' },
                                    { name: 'Vikram Singh', role: 'Delivery Driver', email: 'vikram.s@foodiehub.com', phone: '+1 (555) 678-9012', shift: 'Night (6PM - 2AM)', status: 'Off Duty', statusColor: 'bg-gray-100 text-gray-500', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', joined: 'Sep 2024' },
                                ].map((emp, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 rounded-[28px] p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="flex items-center gap-4">
                                                <img src={emp.avatar} alt={emp.name} className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-700" />
                                                <div>
                                                    <h4 className="font-black text-gray-800 dark:text-white">{emp.name}</h4>
                                                    <p className="text-xs font-bold text-[#ff6b35] uppercase tracking-wider">{emp.role}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${emp.statusColor}`}>
                                                {emp.status}
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <MessageSquare size={14} className="text-gray-400 flex-shrink-0" />
                                                <span className="font-medium truncate">{emp.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <Bell size={14} className="text-gray-400 flex-shrink-0" />
                                                <span className="font-medium">{emp.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <BarChart2 size={14} className="text-gray-400 flex-shrink-0" />
                                                <span className="font-medium">{emp.shift}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined {emp.joined}</span>
                                            <div className="flex items-center gap-2">
                                                <button className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                                                    <Edit size={13} className="text-blue-500" />
                                                </button>
                                                <button className="w-8 h-8 bg-rose-50 dark:bg-rose-900/20 rounded-lg flex items-center justify-center hover:bg-rose-100 transition-colors">
                                                    <Trash2 size={13} className="text-rose-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Message' && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl h-[60vh] flex flex-col border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-slate-700 font-bold text-gray-800 dark:text-white">Messages</div>
                            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                                <div className="flex justify-start"><div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none max-w-[70%] text-sm">Hello, my order is late!</div></div>
                                <div className="flex justify-end"><div className="bg-[#ff6b35] text-white p-3 rounded-2xl rounded-tr-none max-w-[70%] text-sm">We sincerely apologize. Let me check immediately.</div></div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 flex gap-2">
                                <input type="text" placeholder="Type a message..." className="flex-1 bg-white dark:bg-slate-800 border-none px-4 py-2 rounded-xl focus:ring-2 focus:outline-none" />
                                <button className="bg-[#ff6b35] text-white px-4 py-2 rounded-xl font-bold">Send</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Settings' && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Settings</h2>
                            <div className="space-y-6 max-w-lg">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Restaurant Name</label>
                                    <input type="text" defaultValue="FoodieHub Complete" className="w-full mt-1.5 px-4 py-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Contact Email</label>
                                    <input type="email" defaultValue="admin@foodiehub.com" className="w-full mt-1.5 px-4 py-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700" />
                                </div>
                                <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-700">
                                    <span className="font-bold text-gray-800 dark:text-gray-200">Email Notifications</span>
                                    <div className="w-10 h-5 bg-[#ff6b35] rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div></div>
                                </div>
                                <button className="w-full bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-bold py-3 mt-4 rounded-xl">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Manage Items' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Page Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Manage Item</h2>
                                    <p className="text-sm text-gray-400 font-medium mt-1">View and manage all items in your restaurant catalogue</p>
                                </div>
                            </div>

                            {/* Action Buttons Bar */}
                            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                                        <Lock size={14} /> Block
                                    </button>
                                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                                        <Unlock size={14} /> Unblock
                                    </button>
                                    <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                                        <Download size={14} /> Download List
                                    </button>
                                </div>

                                {/* Entries Selector */}
                                <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                                    <span className="font-bold">Show</span>
                                    <select className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-bold text-gray-800 dark:text-white text-sm focus:outline-none">
                                        <option>10</option><option>25</option><option>50</option>
                                    </select>
                                    <span className="font-bold">entries</span>
                                </div>

                                {/* Data Table */}
                                <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-700">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Name</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Code</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Restaurant Name</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Price</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Discounted Price</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Image</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Availability</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Added By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { name: 'Chicken Fried Rice', code: 'S21001', restaurant: 'Palm Restaurant', email: 'kurtsherwood@gmail.com', price: 10.00, discounted: 1.00, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=100&q=80', stock: 'Available', by: 'Admin' },
                                                { name: 'Egg Bread Buns', code: 'S2100', restaurant: 'ABC Restaurant', email: 'andreawilson@gmail.com', price: 7.00, discounted: null, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&q=80', stock: 'Available', by: 'Admin' },
                                                { name: 'Margherita Pizza', code: 'S21003', restaurant: 'REDISH Kitchen', email: 'riddhi@foodiehub.com', price: 12.50, discounted: 2.50, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=100&q=80', stock: 'Available', by: 'Admin' },
                                                { name: 'Classic Burger', code: 'S21004', restaurant: 'REDISH Kitchen', email: 'riddhi@foodiehub.com', price: 8.99, discounted: 1.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80', stock: 'Out of Stock', by: 'Admin' },
                                                { name: 'Caesar Salad', code: 'S21005', restaurant: 'Green Bowl Cafe', email: 'greenbow@gmail.com', price: 6.50, discounted: null, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&q=80', stock: 'Available', by: 'Manager' },
                                            ].map((item, i) => (
                                                <tr key={i} className="border-b border-gray-50 dark:border-slate-800 hover:bg-orange-50/30 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-4 py-4 font-bold text-gray-800 dark:text-white whitespace-nowrap">{item.name}</td>
                                                    <td className="px-4 py-4 text-gray-500 font-medium">{item.code}</td>
                                                    <td className="px-4 py-4">
                                                        <div>
                                                            <p className="font-bold text-gray-800 dark:text-white text-xs">{item.restaurant} -</p>
                                                            <p className="text-[10px] text-gray-400">{item.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-bold text-gray-800 dark:text-white">{item.price.toFixed(2)}</td>
                                                    <td className="px-4 py-4 font-bold text-emerald-600">{item.discounted ? item.discounted.toFixed(2) : '—'}</td>
                                                    <td className="px-4 py-4">
                                                        <img src={item.image} alt={item.name} className="w-16 h-12 object-cover rounded-xl border-2 border-gray-100 dark:border-slate-700 shadow-sm" />
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.stock === 'Available' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                                                            {item.stock}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-col gap-1.5">
                                                            <button className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                                                <Edit size={10} /> Edit
                                                            </button>
                                                            <button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                                                <Unlock size={10} /> Unblock
                                                            </button>
                                                            <button className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                                                <Trash2 size={10} /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-bold text-gray-500">{item.by}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-xs text-gray-400 font-bold">Showing 1 to 5 of 5 entries</p>
                                    <div className="flex items-center gap-2">
                                        <button className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">Previous</button>
                                        <button className="px-3 py-2 bg-[#ff6b35] text-white rounded-lg text-[10px] font-black">1</button>
                                        <button className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Food Menu' && (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
                            {/* Main Content - Left */}
                            <div className="lg:col-span-3 space-y-8">
                                {/* Header with search */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Menu Category</h2>
                                    <div className="relative md:w-80">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input type="text" placeholder="Search menu here...." className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#2bbcf2] transition-all shadow-sm" />
                                    </div>
                                </div>

                                {/* Veg / Non-Veg Filter */}
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-3 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-700 px-8 py-3.5 rounded-2xl hover:shadow-md transition-all group">
                                        <div className="w-6 h-6 border-2 border-emerald-500 rounded flex items-center justify-center">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                        </div>
                                        <span className="text-lg font-black text-gray-800 dark:text-white">Veg</span>
                                    </button>
                                    <button className="flex items-center gap-3 bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-700 px-8 py-3.5 rounded-2xl hover:shadow-md transition-all group">
                                        <div className="w-6 h-6 border-2 border-rose-500 rounded flex items-center justify-center">
                                            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                                        </div>
                                        <span className="text-lg font-black text-gray-800 dark:text-white">Non-Veg</span>
                                    </button>
                                </div>

                                {/* Food Items Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {(foodList.length > 0
                                        ? foodList
                                        : [
                                            { _id: 'd1', name: 'Paneer Tikka', price: 8, category: 'Indian', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80' },
                                            { _id: 'd2', name: 'Veg Biryani', price: 10, category: 'Indian', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80' },
                                            { _id: 'd3', name: 'Pasta Alfredo', price: 12, category: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&q=80' },
                                            { _id: 'd4', name: 'Caesar Salad', price: 7, category: 'Salads', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&q=80' },
                                            { _id: 'd5', name: 'Cheese Burger', price: 9, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80' },
                                            { _id: 'd6', name: 'Margherita Pizza', price: 11, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&q=80' },
                                            { _id: 'd7', name: 'Spring Rolls', price: 6, category: 'Starters', image: 'https://images.unsplash.com/photo-1548507200-84539e8e9192?w=300&q=80' },
                                            { _id: 'd8', name: 'Mango Lassi', price: 5, category: 'Beverages', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&q=80' },
                                        ]
                                    ).slice(0,8).map((item, i) => (
                                        <div key={item._id || i} className="group bg-white dark:bg-slate-800 rounded-[28px] overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                            <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-900">
                                                <img
                                                    src={item.image?.startsWith('http') ? item.image : `${url}/images/${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">{item.name}</h4>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[#ff6b35] font-black">$ {item.price}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold">11 items</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Sidebar - My Cart */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-gray-100 dark:border-slate-700 shadow-sm sticky top-6 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                                        <h3 className="text-lg font-black text-gray-800 dark:text-white">My Cart</h3>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {[
                                            { name: 'Italian Pizza', price: 12.00, qty: 1, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=80&q=80' },
                                            { name: 'Cheese Burger', price: 9.00, qty: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&q=80' },
                                            { name: 'Paneer Tikka', price: 8.00, qty: 1, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=80&q=80' },
                                        ].map((cartItem, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-gray-100 dark:border-slate-700">
                                                <img src={cartItem.image} alt={cartItem.name} className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{cartItem.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <button className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded text-xs font-black text-gray-600 dark:text-gray-300 flex items-center justify-center">-</button>
                                                        <span className="text-xs font-black text-gray-800 dark:text-white">{cartItem.qty}</span>
                                                        <button className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded text-xs font-black text-gray-600 dark:text-gray-300 flex items-center justify-center">+</button>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-[#ff6b35] text-sm">$ {cartItem.price.toFixed(0)}</p>
                                                    <button className="text-rose-400 hover:text-rose-500 mt-1">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div className="p-6 border-t border-gray-100 dark:border-slate-700 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 font-bold">Sub Total</span>
                                            <span className="font-black text-gray-800 dark:text-white">$ 38.00</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 font-bold">Tax</span>
                                            <span className="font-black text-gray-800 dark:text-white">$ 0</span>
                                        </div>
                                        <div className="border-t-2 border-dashed border-gray-200 dark:border-slate-700 pt-4 flex justify-between">
                                            <span className="font-black text-gray-800 dark:text-white text-lg">Total</span>
                                            <span className="font-black text-[#ff6b35] text-xl">$ 38.00</span>
                                        </div>
                                        <button className="w-full bg-[#2bbcf2] hover:bg-[#1da8de] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#2bbcf2]/20 text-sm uppercase tracking-widest transition-all active:scale-95 mt-2">Check Out</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Categories' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Page Title */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Manage Restaurant Category (Cuisine)</h2>
                                    <div className="flex items-center gap-2 mt-2 text-sm">
                                        <span className="text-[#ff6b35] font-bold">Category Management</span>
                                        <span className="text-gray-400">›</span>
                                        <span className="text-gray-500 font-medium">Manage Restaurant Category</span>
                                    </div>
                                </div>
                                <button className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 px-8 py-3 rounded-2xl font-bold text-gray-700 dark:text-white hover:border-[#ff6b35] hover:text-[#ff6b35] transition-all text-sm shadow-sm">
                                    Add Restaurant Category
                                </button>
                            </div>

                            {/* Management Table Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                                        <Lock size={14} /> Block
                                    </button>
                                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                                        <Unlock size={14} /> Unblock
                                    </button>
                                    <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                                        <Download size={14} /> Import
                                    </button>
                                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                                        <Download size={14} /> Download List
                                    </button>
                                </div>

                                {/* Show entries */}
                                <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                                    <span className="font-bold">Show</span>
                                    <select className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-bold text-gray-800 dark:text-white text-sm focus:outline-none">
                                        <option>10</option><option>25</option><option>50</option>
                                    </select>
                                    <span className="font-bold">entries</span>
                                </div>

                                {/* Data Table */}
                                <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-700">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                                                <th className="px-4 py-4 w-10"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">S.No</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category Name</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Edit</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Delete</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Added By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { name: 'Filipino cuisine', status: true, by: 'Admin' },
                                                { name: 'Sayur', status: true, by: 'Admin' },
                                                { name: 'Drinks', status: false, by: 'Admin' },
                                                { name: 'Indian Foods', status: true, by: 'Admin' },
                                                { name: 'Italian Cuisine', status: true, by: 'Manager' },
                                                { name: 'Fast Food', status: true, by: 'Admin' },
                                            ].map((cat, i) => (
                                                <tr key={i} className="border-b border-gray-50 dark:border-slate-800 hover:bg-orange-50/30 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-4 py-4"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                                                    <td className="px-4 py-4 font-bold text-gray-500">{i + 1}</td>
                                                    <td className="px-4 py-4 font-bold text-gray-800 dark:text-white">{cat.name}</td>
                                                    <td className="px-4 py-4 text-center">
                                                        <button className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                                            <Edit size={14} className="text-gray-500" />
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {cat.status ? (
                                                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mx-auto">
                                                                <span className="text-emerald-600 font-black text-sm">✓</span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center mx-auto">
                                                                <span className="text-rose-500 font-black text-sm">⊘</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <button className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto hover:bg-rose-100 hover:text-rose-600 transition-colors">
                                                            <Trash2 size={14} className="text-gray-500" />
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-4 font-bold text-gray-500">{cat.by}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-xs text-gray-400 font-bold">Showing 1 to 6 of 6 entries</p>
                                    <div className="flex items-center gap-2">
                                        <button className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">Previous</button>
                                        <button className="px-3 py-2 bg-[#ff6b35] text-white rounded-lg text-[10px] font-black">1</button>
                                        <button className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">Next</button>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Category Form */}
                            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-10 border border-gray-100 dark:border-slate-700 shadow-sm max-w-2xl mx-auto">
                                <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-8">Edit Category</h3>

                                <div className="space-y-8">
                                    {/* Category Image */}
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Category Image</label>
                                        <div className="relative inline-block">
                                            <div className="w-40 h-28 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-slate-700 shadow-md">
                                                <img src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80" alt="Category" className="w-full h-full object-cover" />
                                            </div>
                                            <button className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
                                                <Edit size={14} className="text-white" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Category Name */}
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Category Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Indian Foods"
                                            className="w-full bg-gray-50/50 dark:bg-slate-900/40 border-b-2 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white px-2 py-4 focus:outline-none focus:border-[#ff6b35] font-bold text-lg transition-colors"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Description</label>
                                        <textarea
                                            rows="4"
                                            defaultValue='I love Indian food. All Indian food. However, when I ask people what their favorite Indian dish is, the answer more often than not is "chicken tikka masala."'
                                            className="w-full bg-gray-50/50 dark:bg-slate-900/40 border-b-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 px-2 py-4 focus:outline-none focus:border-[#ff6b35] font-medium text-sm leading-relaxed resize-none transition-colors"
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex items-center gap-4 pt-4">
                                        <button className="bg-gray-800 dark:bg-gray-200 hover:bg-gray-900 text-white dark:text-gray-900 px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md">Update</button>
                                        <button className="bg-rose-400 hover:bg-rose-500 text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Custom Styles for Scrollbar inside main to keep layout clean */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #d1d5db; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
            `}</style>
        </div>
    );
}

// Subcomponents

function NavItem({ icon, label, active, badge, hasChild, onClick }) {
    return (
        <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                ${active 
                    ? 'bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-[#ff6b35] dark:hover:text-[#ff6b35]'
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-[#ff6b35] transition-colors'}`}>
                    {icon}
                </span>
                <span className="font-semibold text-[15px]">{label}</span>
            </div>
            {hasChild && <span className={`text-xs ${active ? 'text-white/80' : 'text-gray-400'}`}>›</span>}
            {badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </a>
    );
}

function StatCard({ title, value, subtext, icon, data, color, onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`bg-white dark:bg-slate-800 rounded-3xl p-5 border border-gray-100 dark:border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="text-gray-500 dark:text-gray-400 font-semibold text-[15px] mb-1">{title}</h4>
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{value}</h2>
                    <p className="text-xs text-gray-400 font-medium mt-1">{subtext}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-600">
                    {icon}
                </div>
            </div>
            <div className="h-12 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line 
                            type="monotone" 
                            dataKey="v" 
                            stroke={color} 
                            strokeWidth={2} 
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Need this to customize active bar in Recharts
const Rectangle = (props) => {
    const { fill, x, y, width, height } = props;
    return (
        <path 
            d={`M${x},${y + height} L${x},${y + 4} A4,4 0 0,1 ${x + 4},${y} L${x + width - 4},${y} A4,4 0 0,1 ${x + width},${y + 4} L${x + width},${y + height} Z`} 
            stroke="none" 
            fill={fill} 
        />
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 px-3 py-2 border border-gray-100 dark:border-slate-700 rounded-lg shadow-lg">
                <p className="text-[#ff6b35] font-bold text-sm">{`${payload[0].payload.name}, 2023`}</p>
                <p className="text-gray-800 dark:text-white font-black">{`$${payload[0].value.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
};
