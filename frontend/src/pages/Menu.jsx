import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import FoodCard from '../components/FoodCard';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Indian', 'Pasta', 'Grill', 'Desserts', 'Beverages', 'Starters', 'Salads'];
const SORT_OPTIONS = ['Default', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];

export default function Menu() {
    const { foodList } = useStore();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('Default');

    const filtered = useMemo(() => {
        let list = foodList;
        if (category !== 'All') list = list.filter(f => f.category === category);
        if (search) list = list.filter(f =>
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.description.toLowerCase().includes(search.toLowerCase())
        );
        if (sort === 'Price: Low to High') list = [...list].sort((a, b) => a.price - b.price);
        if (sort === 'Price: High to Low') list = [...list].sort((a, b) => b.price - a.price);
        if (sort === 'Top Rated') list = [...list].sort((a, b) => b.rating - a.rating);
        return list;
    }, [foodList, search, category, sort]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-14 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold mb-2">Our Menu</h1>
                    <p className="text-orange-100 text-lg">Fresh, delicious and made with love 🍽️</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 sticky top-16 z-30 border-b border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            id="menu-search"
                            type="text"
                            placeholder="Search dishes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field pl-10 pr-10 py-2.5 text-sm"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                        <select
                            id="sort-select"
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="input-field text-sm py-2.5 w-auto pr-8"
                        >
                            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="max-w-7xl mx-auto px-4 pb-3 overflow-x-auto">
                    <div className="flex gap-2 w-max">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                id={`cat-${cat.toLowerCase()}`}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${category === cat
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-900'
                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-5xl mb-4">🍽️</p>
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No dishes found</h3>
                        <p className="text-gray-500 mt-2">Try a different search or category</p>
                        <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-primary mt-6 inline-block">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{filtered.length} dish{filtered.length !== 1 ? 'es' : ''} found</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map(item => <FoodCard key={item._id} item={item} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
