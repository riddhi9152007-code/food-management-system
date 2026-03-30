import React from 'react';
import { ChefHat, Heart, Users, ShieldCheck, Award, TrendingUp } from 'lucide-react';

const stats = [
    { label: 'Happy Customers', value: '10k+', icon: <Heart className="w-5 h-5" /> },
    { label: 'Talented Chefs', value: '50+', icon: <ChefHat className="w-5 h-5" /> },
    { label: 'Food Items', value: '500+', icon: <Users className="w-5 h-5" /> },
    { label: 'Quality Awards', value: '12', icon: <Award className="w-5 h-5" /> }
];

const values = [
    {
        title: 'Fresh & Organic',
        desc: 'We use the finest local ingredients to ensure every dish meets our gourmet standards.',
        icon: <ShieldCheck className="w-8 h-8 text-orange-500" />
    },
    {
        title: 'Unmatched Speed',
        desc: 'Our delivery network is optimized for one thing: getting hot food to you in record time.',
        icon: <TrendingUp className="w-8 h-8 text-blue-500" />
    },
    {
        title: 'Customer First',
        desc: 'Your satisfaction is our only metric of success. We are here to serve your cravings.',
        icon: <Heart className="w-8 h-8 text-red-500" />
    }
];

export default function About() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 fade-in">
            {/* Header */}
            <header className="hero-gradient py-24 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h1 className="text-5xl md:text-7xl font-black serif-font mb-6 relative z-10">
                    A Passion for <span className="text-gradient">Taste</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light relative z-10 leading-relaxed">
                    Our story began with a simple idea: that fast food can be gourmet.
                    Since 2018, we've been crafting culinary experiences that bridge the gap
                    between speed and excellence.
                </p>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-orange-500/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img
                            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
                            alt="Our Kitchen"
                            className="rounded-[2.5rem] shadow-2xl relative z-10 w-full h-[500px] object-cover"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">Our Mission</h2>
                        <div className="w-16 h-1 bg-orange-500 rounded-full" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                            Foodie Hub isn't just a delivery platform; it's a bridge between culinary artists and those who appreciate fine dining at home.
                            We partner with local legendary restaurants to bring you exclusive menus that were previously unreachable.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                            Every dish is monitored from the kitchen to your door, ensuring temperature control and perfect presentation every single time.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {stats.map((s, idx) => (
                        <div key={idx} className="card p-8 text-center group active:scale-95 transition-transform">
                            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-500 transition-transform group-hover:scale-110">
                                {s.icon}
                            </div>
                            <p className="text-3xl font-black text-gray-800 dark:text-white mb-1">{s.value}</p>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Values Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white serif-font mb-4">What Defines Us</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Commitment to quality is at the core of everything we build.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {values.map((v, idx) => (
                        <div key={idx} className="card p-10 hover:shadow-xl transition-all border-b-4 border-b-orange-500">
                            <div className="mb-6">{v.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{v.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
