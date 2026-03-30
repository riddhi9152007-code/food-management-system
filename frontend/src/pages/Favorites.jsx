import React from 'react';
import { useStore } from '../context/StoreContext';
import FoodCard from '../components/FoodCard';
import { Heart, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
    const { foodList, likedItems } = useStore();
    const favoriteFoods = foodList.filter(item => likedItems.includes(item._id));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8 border-b border-gray-200 dark:border-slate-800 pb-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-red-500 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Favorites</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Food items you love</p>
                    </div>
                </div>

                {favoriteFoods.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favoriteFoods.map(item => (
                            <FoodCard key={item._id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <UtensilsCrossed className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No favorites yet</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Explore our menu and heart the items you like!</p>
                        <Link to="/menu" className="btn-primary px-8">
                            Browse Menu
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
