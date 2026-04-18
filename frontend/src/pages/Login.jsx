import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Eye, EyeOff, ChefHat, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import axios from 'axios';
import BASE_URL from '../BASE_URL';

export default function Login() {
    const { login, url } = useStore();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = mode === 'login' ? `${BASE_URL}/api/user/login` : `${BASE_URL}/api/user/register`;

        try {
            const response = await axios.post(endpoint, form);
            if (response.data.success) {
                login(response.data.user, response.data.token);
                navigate(response.data.user.isAdmin ? '/admin' : '/');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 fade-in">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="card p-8 shadow-xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {mode === 'login' ? 'Sign in to your Foodie Hub account' : 'Join Foodie Hub today'}
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="flex bg-gray-100 dark:bg-slate-700 rounded-xl p-1 mb-6">
                        {['login', 'register'].map(m => (
                            <button
                                key={m}
                                id={`${m}-tab`}
                                onClick={() => { setMode(m); setError(''); }}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-white dark:bg-slate-600 text-gray-800 dark:text-white shadow' : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                {m === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        id="reg-name"
                                        name="name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="login-password"
                                    name="password"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="input-field pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            id="auth-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base mt-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8A8 8 0 014 12z" />
                                </svg>
                            ) : (
                                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    {/* Demo hint */}
                    {mode === 'login' && (
                        <div className="mt-5 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-xs text-gray-600 dark:text-gray-400 border border-orange-100 dark:border-orange-800">
                            <p className="font-semibold text-orange-600 dark:text-orange-400 mb-1">Demo Credentials:</p>
                            <p>Admin: <strong>riddhi@foodiehub.com</strong> / <strong>riddhi915</strong></p>
                            <p>User: <strong>priya@example.com</strong> / <strong>password</strong></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
