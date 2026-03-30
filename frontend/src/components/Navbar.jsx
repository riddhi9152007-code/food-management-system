import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, X, Sun, Moon, User, LogOut, LayoutDashboard, ChefHat, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar({ onCartOpen }) {
    const { getCartCount, likedItems, isDark, setIsDark, user, logout } = useStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const cartCount = getCartCount();

    const links = [
        { to: '/', label: 'Home' },
        { to: '/menu', label: 'Menu' },
        { to: '/favorites', label: 'Favorites' },
        { to: '/orders', label: 'My Orders' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">
                            Foodie<span className="text-orange-500">Hub</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === link.to
                                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user?.isAdmin && (
                            <Link
                                to="/admin"
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all ${location.pathname === '/admin'
                                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <LayoutDashboard className="w-4 h-4" /> Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                            title="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <Link
                            to="/favorites"
                            className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                            title="Favorites"
                        >
                            <Heart className={`w-5 h-5 ${likedItems.length > 0 ? 'text-red-500 fill-current' : ''}`} />
                            {likedItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                    {likedItems.length}
                                </span>
                            )}
                        </Link>

                        <Link
                            to="/cart"
                            className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                            title="Shopping Cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{user.name}</span>
                                <button onClick={handleLogout} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all" title="Logout">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="hidden md:flex items-center gap-1 btn-primary text-sm">
                                <User className="w-4 h-4" /> Login
                            </Link>
                        )}

                        <button
                            className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden py-3 border-t border-gray-100 dark:border-slate-800 fade-in">
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user?.isAdmin && (
                            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-orange-500 font-medium">
                                Admin Dashboard
                            </Link>
                        )}
                        {user ? (
                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-orange-500 font-semibold">
                                Login / Register
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
