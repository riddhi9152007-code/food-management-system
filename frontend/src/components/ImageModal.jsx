import React from 'react';
import { X, Star, MessageSquare } from 'lucide-react';

export default function ImageModal({ isOpen, onClose, imageUrl, itemName, price, rating, reviews }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div className="relative max-w-4xl w-full h-[80vh] flex flex-col items-center justify-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium"
                >
                    <span>Close</span>
                    <X className="w-6 h-6" />
                </button>

                {/* Image Container */}
                <div
                    className="relative w-full h-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 zoom-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={imageUrl}
                        alt={itemName}
                        className="w-full h-full object-contain"
                    />

                    {/* Caption Overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-white text-3xl font-black tracking-tight">{itemName}</h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                        <Star className="w-5 h-5 fill-amber-400" />
                                        <span>{rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium border-l border-white/10 pl-4">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{reviews} Reviews</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-orange-500 font-black text-4xl">
                                ${price}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
