import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Plus, Minus, Maximize2, Heart, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import ImageModal from './ImageModal';

export default function FoodCard({ item }) {
    const { cartItems, addToCart, removeFromCart, likedItems, toggleLike, url } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const qty = cartItems[item._id] || 0;

    const imageUrl = item.image.startsWith('http') ? item.image : `${url}/images/${item.image}`;

    return (
        <>
            <motion.div 
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="food-card card overflow-hidden group cursor-pointer h-full flex flex-col premium-card-hover"
            >
                {/* Image Section */}
                <div
                    className="relative overflow-hidden h-44 cursor-zoom-in"
                    onClick={() => setIsModalOpen(true)}
                >
                    <motion.img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80'; }}
                    />

                    {/* View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xs font-bold gap-2">
                        <Maximize2 className="w-4 h-4" /> View Details
                    </div>

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="badge glass-card !bg-orange-500 text-white border-none px-3 py-1 text-[10px] shadow-lg">
                            {item.category}
                        </span>
                        {item.rating > 4.5 && (
                            <span className="badge glass-card !bg-amber-500 text-white border-none px-3 py-1 text-[10px] shadow-lg flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Best Seller
                            </span>
                        )}
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col items-center gap-2">
                        <motion.div 
                            className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl px-2 py-1 text-[10px] font-black text-amber-500 shadow-lg"
                        >
                            <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" /> {item.rating}
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); toggleLike(item._id); }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-lg ${likedItems.includes(item._id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/90 dark:bg-slate-900/90 text-gray-400 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${likedItems.includes(item._id) ? 'fill-current' : ''}`} />
                        </motion.button>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                        <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight leading-tight group-hover:text-orange-500 transition-colors uppercase">{item.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-[8px] font-black uppercase tracking-widest leading-none mb-0.5">Price</span>
                            <span className="text-gray-900 dark:text-white font-black text-xl tracking-tighter">${item.price}</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {qty === 0 ? (
                                <motion.button
                                    key="add-btn"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addToCart(item._id)}
                                    className="flex items-center gap-2 bg-slate-900 dark:bg-orange-500 hover:bg-orange-500 text-white text-[11px] font-black px-4 py-2.5 rounded-2xl transition-all shadow-md uppercase tracking-wider"
                                >
                                    <Plus className="w-3 h-3" /> Add
                                </motion.button>
                            ) : (
                                <motion.div 
                                    key="qty-control"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-1 shadow-inner"
                                >
                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={() => removeFromCart(item._id)}
                                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-orange-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </motion.button>
                                    <span className="w-6 text-center font-black text-gray-900 dark:text-white text-sm">{qty}</span>
                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={() => addToCart(item._id)}
                                        className="w-8 h-8 rounded-xl bg-orange-500 shadow-md text-white flex items-center justify-center hover:bg-orange-600 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Image Modal */}
            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageUrl={imageUrl}
                itemName={item.name}
                price={item.price}
                rating={item.rating}
                reviews={item.reviews}
            />
        </>
    );
}

