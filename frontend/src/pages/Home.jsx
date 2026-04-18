import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Sun, Moon, Heart, Star, ChefHat, ArrowRight, Download, Smartphone, Apple } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import FoodCard from '../components/FoodCard';

const menuLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Delivery', to: '/delivery' },
    { label: 'Recipes', to: '/recipes' },
    { label: 'Contact', to: '/contact' }
];

const CATEGORIES = [
    { name: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80' },
    { name: 'Rolls', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=80' },
    { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80' },
    { name: 'Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&q=80' },
    { name: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80' },
    { name: 'Pure Veg', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&q=80' },
    { name: 'Pasta', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=200&q=80' },
    { name: 'Noodles', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=200&q=80' }
];

export default function Home() {
    const { foodList, addToCart, isDark, setIsDark, likedItems, getCartCount, user } = useStore();
    const [activeLink, setActiveLink] = useState('Home');
    const [selectedCategory, setSelectedCategory] = useState("All");
    const menuRef = useRef(null);

    const featuredDishes = [
        { id: 'f1', name: 'Buddha Nourish Bowl', category: 'Health Special', price: 18, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' },
        { id: 'f2', name: 'Mediterranean Zest', category: 'Italian', price: 22, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' },
        { id: 'f3', name: 'Grilled Paneer Special', category: 'Indian Gourmet', price: 25, image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=500&q=80' },
        { id: 'f4', name: 'Quinoa Power Salad', category: 'Protein Rich', price: 19, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80' }
    ];

    const scrollToMenu = () => {
        menuRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-slate-950 font-['Outfit',sans-serif] selection:bg-orange-500 selection:text-white transition-colors duration-500">
            
            {/* Hero Section */}
            <main className="pt-24 px-6 lg:pt-32 overflow-hidden">
                <div className="max-w-7xl mx-auto relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        
                        {/* Text Side */}
                        <div className="relative z-10 space-y-10 max-w-xl">
                            <motion.h1 
                                initial={{ opacity: 0, x: -60 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-6xl md:text-[5.5rem] font-black text-slate-900 dark:text-white leading-[1] tracking-tighter"
                            >
                                From Kitchen to <br /> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF9F33]">
                                    Your Door
                                </span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, x: -60 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed"
                            >
                                Welcome to FoodieHub, where culinary delights <br /> 
                                meet doorstep convenience. Indulge in a seamless dining
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex items-center gap-6"
                            >
                                <button 
                                    onClick={scrollToMenu}
                                    className="bg-[#FF9F33] hover:bg-[#E88A1A] text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-3"
                                >
                                    Get Tasty Meals <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        </div>

                        {/* Large Dish Design Side */}
                        <div className="relative hidden lg:block h-[500px]">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.2 }}
                                className="absolute top-[-250px] right-[-100px] w-[650px] h-[650px] bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-2xl"
                            >
                                <div className="absolute left-[-140px] flex items-center translate-y-20">
                                    {/* Main Large Plate */}
                                    <div className="w-[480px] h-[480px] bg-white rounded-full p-2 relative shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden">
                                        <div className="w-full h-full rounded-full overflow-hidden border-[15px] border-[#F8F8F8]">
                                            <img 
                                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&q=90" 
                                                alt="Featured Plate" 
                                                className="w-full h-full object-cover animate-slow-spin" 
                                            />
                                        </div>
                                    </div>

                                    {/* Vertical Text */}
                                    <div className="ml-10 rotate-180 opacity-20">
                                        <span className="text-white font-black text-6xl uppercase tracking-[0.4em] [writing-mode:vertical-lr]">FOODIE</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Featured Dish Cards Row */}
                    <div className="mt-48 pb-32 relative z-20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {featuredDishes.map((dish, idx) => (
                                <motion.div 
                                    key={dish.id}
                                    initial={{ opacity: 0, y: 60 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 + (idx * 0.1) }}
                                    className="group bg-white dark:bg-slate-900 p-8 rounded-[48px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(255,107,53,0.12)] hover:-translate-y-4 transition-all duration-500 relative"
                                >
                                    <div className="absolute -top-12 left-8 w-36 h-36 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-2xl overflow-hidden border-4 border-gray-50 dark:border-slate-800 z-30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div className="flex justify-end mb-16">
                                        <div className="bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-2xl">
                                            <span className="text-[#FF6B35] font-black text-2xl">$ {dish.price}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-5">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-[#FF6B35] transition-colors">{dish.name}</h3>
                                            <p className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">{dish.category}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800">
                                            <div className="flex gap-1.5">
                                                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[#FF6B35] text-[#FF6B35]" />)}
                                            </div>
                                            <button onClick={() => addToCart(dish.id.toString())} className="w-12 h-12 bg-[#FF6B35] text-white rounded-2xl flex items-center justify-center hover:bg-[#1A1A1A] hover:scale-110 transition-all shadow-lg active:scale-90">
                                                <ShoppingCart size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Explore Menu Section (Restored & Premium) */}
            <section ref={menuRef} className="py-32 px-6 bg-white dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Explore our menu</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto font-medium">Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience.</p>
                    </div>

                    <div className="flex items-center gap-8 overflow-x-auto pb-10 no-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <button 
                                key={cat.name}
                                onClick={() => setSelectedCategory(prev => prev === cat.name ? "All" : cat.name)}
                                className="flex-shrink-0 group flex flex-col items-center gap-4"
                            >
                                <div className={`w-28 h-28 rounded-full p-1.5 transition-all duration-500 ${selectedCategory === cat.name ? 'ring-4 ring-[#FF6B35] scale-110' : 'ring-2 ring-gray-100 group-hover:scale-105'}`}>
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <span className={`text-sm font-black uppercase tracking-widest ${selectedCategory === cat.name ? 'text-[#FF6B35]' : 'text-gray-500'}`}>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Dishes Section (Restored & Premium) */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-16">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white">Top dishes near you</h2>
                            <div className="w-24 h-2 bg-[#FF6B35] rounded-full" />
                        </div>
                        <Link to="/menu" className="text-sm font-black text-[#FF6B35] uppercase tracking-widest hover:translate-x-2 transition-transform inline-flex items-center gap-2">View Full Menu <ArrowRight size={16} /></Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {foodList
                            .filter(item => selectedCategory === "All" || item.category === selectedCategory)
                            .map((item) => <FoodCard key={item._id} item={item} />)
                        }
                    </div>
                </div>
            </section>

            {/* App Download Section (Restored & Premium) */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto bg-[#1A1A1A] rounded-[60px] p-12 md:p-24 relative overflow-hidden">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">For Better Experience Download <br /><span className="text-[#FF6B35]">FoodieHub App</span></h2>
                            <div className="flex flex-wrap gap-6">
                                <button className="bg-white hover:bg-gray-100 text-[#1A1A1A] px-8 py-4 rounded-2xl font-black flex items-center gap-4 transition-all hover:-translate-y-1 shadow-xl">
                                    <Smartphone className="text-orange-500" />
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500">Get it on</p>
                                        <p className="text-lg">Google Play</p>
                                    </div>
                                </button>
                                <button className="bg-white hover:bg-gray-100 text-[#1A1A1A] px-8 py-4 rounded-2xl font-black flex items-center gap-4 transition-all hover:-translate-y-1 shadow-xl">
                                    <Apple className="text-orange-500" />
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500">Download on the</p>
                                        <p className="text-lg">App Store</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <div className="w-[380px] h-[700px] bg-[#333] rounded-[60px] border-[12px] border-[#222] shadow-2xl relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80" alt="App Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10 space-y-4">
                                    <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-6" />
                                    <h3 className="text-2xl font-black text-white">Order in 1 Click</h3>
                                    <p className="text-gray-400 text-sm">Download today for exclusive offers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section (Restored & Premium) */}
            <footer className="bg-[#1A1A1A] text-white pt-24 pb-12 px-6 mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <ChefHat className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-black">Foodie<span className="text-orange-500">Hub</span></span>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed">Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience.</p>
                            <div className="flex gap-4">
                                {[1, 2, 3].map(i => (
                                    <button key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 transition-all">
                                        <div className="w-5 h-5 bg-white/20 rounded-full" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h4 className="text-xl font-bold mb-8 uppercase tracking-widest text-[#FF6B35]">COMPANY</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><Link to="/" className="hover:text-orange-500 transition-colors cursor-pointer">Home</Link></li>
                                <li><Link to="/about" className="hover:text-orange-500 transition-colors cursor-pointer">About Us</Link></li>
                                <li><Link to="/delivery" className="hover:text-orange-500 transition-colors cursor-pointer">Delivery</Link></li>
                                <li><Link to="/privacy" className="hover:text-orange-500 transition-colors cursor-pointer">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h4 className="text-xl font-bold mb-8 uppercase tracking-widest text-[#FF6B35]">GET IN TOUCH</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><a href="tel:+1-212-456-7890" className="hover:text-orange-500 transition-colors cursor-pointer">+1-212-456-7890</a></li>
                                <li><a href="mailto:contact@foodiehub.com" className="hover:text-orange-500 transition-colors cursor-pointer">contact@foodiehub.com</a></li>
                            </ul>
                        </div>

                        {/* Newsletter Column */}
                        <div>
                            <h4 className="text-xl font-bold mb-8 uppercase tracking-widest text-[#FF6B35]">NEWSLETTER</h4>
                            <p className="text-gray-400 text-sm mb-6">Stay updated with our latest offers.</p>
                            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                                <input type="text" placeholder="Email" className="bg-transparent border-none focus:ring-0 text-sm px-4 py-2 w-full text-white" />
                                <button className="bg-orange-500 px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-orange-600 transition-all">Join</button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 text-center">
                        <p className="text-gray-500 text-sm">Copyright 2024 © FoodieHub.com - All Rights Reserved.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes slow-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-slow-spin {
                    animation: slow-spin 20s linear infinite;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}



