import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Shield, Truck, ChefHat, Flame, Award, ChevronRight, Mail, Phone, MapPin, Zap, MousePointer2 } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import FoodCard from '../components/FoodCard';

const categories = ['All', 'Pizza', 'Burger', 'Indian', 'Pasta', 'Grill', 'Desserts', 'Beverages', 'Starters', 'Salads'];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const Marquee = () => {
    return (
        <div className="w-full bg-orange-600 overflow-hidden py-5 z-50 relative my-16 shadow-[0_0_60px_rgba(255,107,53,0.3)] border-y border-white/10">
            <motion.div
                animate={{ x: [0, -1500] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="flex whitespace-nowrap items-center text-white/90"
            >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex items-center gap-12 px-6 font-black text-xl md:text-3xl uppercase tracking-[0.3em] shrink-0">
                        <span>100% Organic</span>
                        <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
                        <span>Award Winning</span>
                        <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
                        <span>Premium Cuisine</span>
                        <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default function Home() {
    const { foodList } = useStore();
    const [activeCategory, setActiveCategory] = useState('All');
    const featured = foodList.filter(f => [5, 6, 7, 8, 9, 10, 11].includes(Number(f._id))).slice(0, 8);
    
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

    return (
        <div className="overflow-x-hidden mesh-bg selection:bg-orange-500 selection:text-white">
            <motion.div
                className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600 z-[60] origin-left"
                style={{ scaleX }}
            />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-16 px-4 overflow-hidden hero-gradient text-white">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 45, 0],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[120px]" 
                />

                {/* Floating Particles */}
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, (i % 2 === 0 ? 40 : -40), 0],
                            x: [0, (i % 2 !== 0 ? 40 : -40), 0],
                            scale: [1, 1.5, 1],
                            opacity: [0.2, 0.6, 0.2]
                        }}
                        transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute hidden md:block rounded-full mix-blend-screen pointer-events-none"
                        style={{
                            top: `${15 * i}%`,
                            left: `${15 * i + 10}%`,
                            width: `${10 + i * 4}px`,
                            height: `${10 + i * 4}px`,
                            background: `radial-gradient(circle, rgba(255,107,53,0.8) 0%, rgba(255,107,53,0) 70%)`,
                            filter: 'blur(3px)'
                        }}
                    />
                ))}
                
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10 py-8">
                    <motion.div 
                        style={{ y: yHero, opacity: opacityHero }}
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <motion.div 
                            initial={{ opacity: 0, filter: "blur(8px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-full px-4 py-2 text-orange-400 text-xs font-black tracking-[0.15em] shadow-xl uppercase"
                        >
                            <motion.div 
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="h-2 w-2 rounded-full bg-orange-500" 
                            />
                            Premium Gourmet Experience
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter serif-font overflow-hidden flex flex-col gap-2">
                            <motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="block">Savor</motion.span>
                            <motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} className="block text-gradient pb-6 -mb-6">Exquisite</motion.span>
                            <motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="block">Dining</motion.span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed font-light">
                            Crafting culinary masterpieces delivered with <span className="text-white font-medium underline underline-offset-4 decoration-orange-500/50">precision</span> and care.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link to="/menu" className="btn-primary flex items-center gap-3 px-8 py-4 text-base group rounded-[20px]">
                                    Browse Menu
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link to="/menu" className="btn-secondary !bg-white/5 !border-white/10 flex items-center gap-3 px-8 py-4 text-base backdrop-blur-2xl rounded-[20px] border">
                                    Our Story
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="flex flex-wrap gap-10 pt-10 border-t border-white/10"
                        >
                            {[
                                { val: '500k+', label: 'Happy Diners' },
                                { val: '100%', label: 'Organic' },
                                { val: '24/7', label: 'Support' }
                            ].map((stat) => (
                                <motion.div key={stat.label} variants={itemVariants}>
                                    <p className="text-2xl font-black text-white leading-none">{stat.val}</p>
                                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black mt-2">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 relative hidden lg:block"
                    >
                        <div className="relative z-10">
                            <motion.div 
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative rounded-[50px] p-1.5 bg-gradient-to-tr from-white/10 to-transparent backdrop-blur-sm shadow-2xl"
                            >
                                <div className="rounded-[44px] overflow-hidden">
                                    <img
                                        src="/premium_veg_dish.png"
                                        alt="Chef's Special"
                                        className="w-full h-[500px] object-cover"
                                    />
                                </div>
                                <motion.div 
                                    drag
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    className="absolute -bottom-6 -right-6 glass-card !bg-orange-600 border-none p-6 rounded-[30px] shadow-xl"
                                >
                                    <Award className="w-8 h-8 text-white mb-2" />
                                    <p className="text-white font-black text-lg tracking-tighter leading-tight">Voted #1 <br /> Taste 2026</p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white"
                >
                    <p className="text-[8px] font-black uppercase tracking-[0.3em]">Scroll</p>
                    <div className="w-0.5 h-10 bg-gradient-to-b from-orange-500 to-transparent" />
                </motion.div>
            </section>

            <Marquee />

            {/* Categories */}
            <section className="py-16 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex overflow-x-auto gap-3 pb-6 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 border-2 ${
                                    activeCategory === cat 
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg' 
                                    : 'bg-transparent border-gray-100 dark:border-slate-800 text-gray-400 hover:border-orange-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Section */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <span className="text-orange-500 font-black tracking-[0.4em] text-[10px] uppercase block mb-2">Discovery</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Most Requested <span className="text-gradient">Dishes</span></h2>
                    </motion.div>
                    <Link to="/menu" className="group flex items-center gap-4 text-slate-900 dark:text-white font-black">
                        <span className="text-sm underline underline-offset-4 decoration-orange-500">View Full Menu</span>
                        <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featured.map(item => (
                        <FoodCard key={item._id} item={item} />
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-slate-900/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter"
                        >
                            The Journey <span className="text-orange-500">To You</span>
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Selection', desc: 'Handpicked fresh ingredients.', icon: <ChefHat className="w-6 h-6" /> },
                            { step: '02', title: 'Artistry', desc: 'Crafted by expert chefs.', icon: <Star className="w-6 h-6" /> },
                            { step: '03', title: 'Velocity', desc: 'Express delivery in record time.', icon: <Zap className="w-6 h-6" /> },
                            { step: '04', title: 'Euphoria', desc: 'A taste that stays with you.', icon: <Flame className="w-6 h-6" /> },
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-8 rounded-[35px] bg-white dark:bg-slate-950 shadow-xl hover:bg-slate-900 dark:hover:bg-orange-600 transition-all duration-500 relative overflow-hidden"
                            >
                                <span className="absolute -top-2 -right-1 text-7xl font-black text-slate-50 dark:text-slate-900 group-hover:text-white/5 pointer-events-none">{item.step}</span>
                                <div className="w-12 h-12 bg-orange-500/10 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white transition-all">
                                    <div className="text-orange-500">{item.icon}</div>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-white">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 group-hover:text-white/80 text-sm font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600" />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <ChefHat className="w-16 h-16 text-white mx-auto mb-8 opacity-50" />
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready for <br /> <span className="underline decoration-white/30">Excellence?</span></h2>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/menu" className="inline-flex items-center gap-3 bg-white text-orange-600 font-black text-xl py-6 px-12 rounded-[30px] shadow-2xl transition-all">
                            Order Now
                            <ChevronRight className="w-6 h-6" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 pt-24 pb-12 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-12 gap-16 mb-20">
                        <div className="md:col-span-5 space-y-8">
                            <Link to="/" className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <ChefHat className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-3xl font-black text-white uppercase">Foodie<span className="text-orange-500">Hub</span></span>
                            </Link>
                            <p className="text-slate-500 max-w-sm text-lg font-light leading-relaxed">
                                Redefining dining with masterpieces delivered to your door.
                            </p>
                        </div>

                        <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
                            <div className="space-y-6">
                                <h4 className="text-white font-black text-[10px] tracking-[0.3em] uppercase opacity-50">Quick Links</h4>
                                <ul className="space-y-4 text-slate-400 font-black text-xs tracking-widest uppercase">
                                    <li><Link to="/menu" className="hover:text-orange-500 transition-all">Menu</Link></li>
                                    <li><Link to="/about" className="hover:text-orange-500 transition-all">About</Link></li>
                                    <li><Link to="/contact" className="hover:text-orange-500 transition-all">Support</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-6 col-span-2 md:col-span-1">
                                <h4 className="text-white font-black text-[10px] tracking-[0.3em] uppercase opacity-50">Contact</h4>
                                <div className="space-y-4 text-slate-500 text-xs font-black uppercase tracking-widest">
                                    <p className="flex items-center gap-3"><Phone className="text-orange-500 w-4 h-4" /> (800) FD-HUB</p>
                                    <p className="flex items-center gap-3"><Mail className="text-orange-500 w-4 h-4" /> Support@hub.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black tracking-[0.3em] text-slate-600 uppercase">
                        <p>© 2026 FOODIE HUB GLOBAL.</p>
                        <div className="flex gap-10">
                            <a href="#" className="hover:text-white">Privacy</a>
                            <a href="#" className="hover:text-white">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}



