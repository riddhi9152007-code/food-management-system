import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Cart() {
    const { foodList, cartItems, addToCart, removeFromCart, getCartTotal, placeOrder, user, url, token } = useStore();
    const [address, setAddress] = useState('');
    const [placing, setPlacing] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const cartFoods = Object.entries(cartItems)
        .map(([id, qty]) => {
            const item = foodList.find(f => f._id === id);
            if (!item) return null;
            return { ...item, qty };
        })
        .filter(Boolean);

    const subtotal = getCartTotal();
    const delivery = subtotal > 500 ? 0 : 49;
    const total = subtotal + delivery;

    const handleOrder = async () => {
        if (!token) {
            alert('Please login to place an order.');
            navigate('/login');
            return;
        }
        if (!address.trim()) return alert('Please enter a delivery address.');

        setPlacing(true);
        const orderData = {
            items: cartFoods.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
            amount: total,
            address: address,
            userName: user?.name || "Guest"
        };

        try {
            const res = await placeOrder(orderData);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => { navigate('/orders'); }, 1800);
            } else {
                alert("Error placing order. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Connection error. Try again.");
        }
        setPlacing(false);
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center fade-in">
                <div className="text-center p-10">
                    <div className="text-7xl mb-6 animate-bounce">🎉</div>
                    <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Order Placed!</h2>
                    <p className="text-gray-500 dark:text-gray-400">Redirecting to your orders...</p>
                </div>
            </div>
        );
    }

    if (cartFoods.length === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center fade-in">
                <div className="text-center p-10">
                    <ShoppingBag className="w-20 h-20 text-gray-200 dark:text-slate-700 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add some delicious dishes and come back!</p>
                    <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                        Browse Menu <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 fade-in">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Your Cart 🛒</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">{cartFoods.length} item{cartFoods.length !== 1 ? 's' : ''} in your cart</p>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartFoods.map(item => {
                            const imageUrl = item.image.startsWith('http') ? item.image : `${url}/images/${item.image}`;
                            return (
                                <div key={item._id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-all">
                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=60'; }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-800 dark:text-white truncate">{item.name}</h3>
                                        <p className="text-orange-500 font-semibold mt-1">₹{item.price} each</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-xl px-1 py-1">
                                            <button onClick={() => removeFromCart(item._id)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 shadow text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                                                {item.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                                            </button>
                                            <span className="w-6 text-center font-bold text-gray-800 dark:text-white">{item.qty}</span>
                                            <button onClick={() => addToCart(item._id)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 shadow text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <span className="font-bold text-gray-800 dark:text-white w-20 text-right">₹{item.price * item.qty}</span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Delivery address */}
                        <div className="card p-6">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-orange-500" /> Delivery Address
                            </h3>
                            <textarea
                                id="delivery-address"
                                rows={3}
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Enter your full delivery address..."
                                className="input-field resize-none"
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Truck className="w-3.5 h-3.5" /> Delivery
                                    </span>
                                    <span className={delivery === 0 ? 'text-green-500 font-semibold' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                                </div>
                                {delivery > 0 && (
                                    <p className="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                                        Add ₹{500 - subtotal} more for free delivery!
                                    </p>
                                )}
                                <div className="border-t border-gray-100 dark:border-slate-700 pt-3 flex justify-between font-bold text-gray-800 dark:text-white text-lg">
                                    <span>Total</span>
                                    <span className="text-orange-500">₹{total}</span>
                                </div>
                            </div>

                            <button
                                id="place-order-btn"
                                onClick={handleOrder}
                                disabled={placing}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {placing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3v4a12 12 0 010-24z" />
                                        </svg>
                                        Placing Order...
                                    </span>
                                ) : (
                                    <><ArrowRight className="w-5 h-5" /> Place Order</>
                                )}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                🔒 Secure checkout · COD available
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
