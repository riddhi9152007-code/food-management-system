import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, Clock, Truck, XCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const STATUS_CONFIG = {
    'Pending': { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: <Clock className="w-4 h-4" />, dot: 'bg-yellow-400' },
    'Processing': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: <Package className="w-4 h-4" />, dot: 'bg-blue-400' },
    'Out for Delivery': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', icon: <Truck className="w-4 h-4" />, dot: 'bg-orange-400' },
    'Delivered': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: <CheckCircle className="w-4 h-4" />, dot: 'bg-green-400' },
    'Cancelled': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: <XCircle className="w-4 h-4" />, dot: 'bg-red-400' },
};

const FILTERS = ['All', 'Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function Orders() {
    const { token, url } = useStore();
    const [orders, setOrders] = React.useState([]);
    const [filter, setFilter] = useState('All');
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.data.reverse());
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
        setLoading(false);
    };

    React.useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    if (orders.length === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center fade-in">
                <div className="text-center p-10">
                    <Package className="w-24 h-24 text-gray-200 dark:text-slate-700 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-6">Your order history will appear here</p>
                    <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                        Start Ordering <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 fade-in">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">My Orders 📦</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            id={`filter-${f.toLowerCase().replace(/ /g, '-')}`}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-orange-300'
                                }`}
                        >
                            {f}
                            {f === 'All' ? '' : ` (${orders.filter(o => o.status === f).length})`}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-3">📭</p>
                            <p className="text-gray-500 dark:text-gray-400">No {filter.toLowerCase()} orders</p>
                        </div>
                    ) : filtered.map(order => {
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
                        const isOpen = expanded === order._id;
                        return (
                            <div key={order._id} className="card overflow-hidden hover:shadow-md transition-all">
                                {/* Header */}
                                <button
                                    className="w-full text-left p-5 flex flex-wrap items-center gap-4"
                                    onClick={() => setExpanded(isOpen ? null : order._id)}
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-bold text-gray-800 dark:text-white">{order._id}</span>
                                            <span className={`badge flex items-center gap-1 ${cfg.color}`}>
                                                {cfg.icon} {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            {order.date} · {order.items.length} item{order.items.length !== 1 ? 's' : ''} · <span className="font-semibold text-orange-500">₹{order.total}</span>
                                        </p>
                                    </div>
                                    {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                                </button>

                                {/* Details */}
                                {isOpen && (
                                    <div className="border-t border-gray-100 dark:border-slate-700 px-5 py-4 bg-gray-50 dark:bg-slate-800/50 fade-in">
                                        <div className="space-y-2 mb-4">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-gray-700 dark:text-gray-300">{item.name} × {item.qty}</span>
                                                    <span className="font-medium text-gray-800 dark:text-white">₹{item.price * item.qty}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-sm font-bold border-t border-gray-200 dark:border-slate-600 pt-2">
                                            <span className="text-gray-800 dark:text-white">Total</span>
                                            <span className="text-orange-500">₹{order.total}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1">
                                            <Truck className="w-3.5 h-3.5" /> {order.address}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
