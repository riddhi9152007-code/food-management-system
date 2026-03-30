import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for reaching out! Our team will contact you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 fade-in">
            {/* Header */}
            <header className="hero-gradient py-24 px-4 text-center text-white relative">
                <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
                <h1 className="text-5xl md:text-7xl font-black serif-font mb-6 relative z-10">
                    Get in <span className="text-gradient">Touch</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto font-light relative z-10 leading-relaxed">
                    Have any questions, concerns, or feedback? Reach out and we'll be here to help.
                    Expect a response within 2-4 hours.
                </p>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-12 gap-16 items-start">

                    {/* Contact Form */}
                    <div className="lg:col-span-7 card p-8 md:p-12 relative z-10 shadow-2xl">
                        <div className="mb-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Send Us a Message</h3>
                                <p className="text-gray-500 text-sm">We'd love to hear from you.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your name"
                                        className="input-field"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="johndoe@example.com"
                                        className="input-field"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="How can we help?"
                                    className="input-field"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Tell us your feedback</label>
                                <textarea
                                    rows={5}
                                    required
                                    placeholder="Your message here..."
                                    className="input-field resize-none"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg">
                                Send Message <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-8">
                            {[
                                { title: 'Our Office', value: '123 Gourmet Street, Silicon Valley, CA 94043', icon: <MapPin className="text-orange-500" /> },
                                { title: 'Phone Support', value: '+1 (800) 987-6543 / 24X7 Helpline', icon: <Phone className="text-blue-500" /> },
                                { title: 'Email Support', value: 'support@foodiehub.com / contact@foodiehub.com', icon: <Mail className="text-green-500" /> }
                            ].map((info, idx) => (
                                <div key={idx} className="flex gap-6 group hover:translate-x-2 transition-transform duration-300">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                                        {info.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">{info.title}</p>
                                        <p className="text-lg text-gray-800 dark:text-gray-100 font-medium">{info.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="card p-8 bg-orange-500/5 border-orange-500/10">
                            <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6 serif-font">Connect with us on Socials</h4>
                            <div className="flex gap-4">
                                {[
                                    { name: 'Instagram', icon: <Instagram />, color: 'hover:bg-pink-500' },
                                    { name: 'Twitter', icon: <Twitter />, color: 'hover:bg-blue-400' },
                                    { name: 'Facebook', icon: <Facebook />, color: 'hover:bg-blue-600' }
                                ].map(social => (
                                    <button
                                        key={social.name}
                                        className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 shadow-md flex items-center justify-center transition-all ${social.color} hover:text-white hover:scale-110 active:scale-90`}
                                    >
                                        {social.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Premium CTA */}
                        <div className="relative rounded-[32px] overflow-hidden group h-64 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt="Support Center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                                <p className="text-white font-black text-xl leading-snug">Our 24/7 dedicated support team is ready to serve you.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
