import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const url = "http://localhost:5000";
    const [cartItems, setCartItems] = useState({});
    const [foodList, setFoodList] = useState([]);
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [likedItems, setLikedItems] = useState([]);
    const [isDark, setIsDark] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    // Set dark mode
    useEffect(() => {
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDark]);

    // Fetch Food List
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setFoodList(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    // Load User Profile
    const loadUserProfile = async (token) => {
        try {
            const response = await axios.get(`${url}/api/user/profile`, { headers: { token } });
            if (response.data.success) {
                setUser(response.data.user);
                setLikedItems(response.data.user.likedItems || []);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    // Load Cart Data
    const loadCartData = async (token) => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    };

    // Initial Load
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadUserProfile(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems(prev => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems(prev => {
            const updated = { ...prev };
            if (updated[itemId] > 1) updated[itemId] -= 1;
            else delete updated[itemId];
            return updated;
        });
        if (token) {
            await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
        }
    };

    const clearCart = () => setCartItems({});

    const getCartTotal = () => {
        return Object.entries(cartItems).reduce((total, [id, qty]) => {
            const item = foodList.find(f => f._id === id);
            return item ? total + item.price * qty : total;
        }, 0);
    };

    const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);

    const placeOrder = async (orderData) => {
        try {
            const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
            if (response.data.success) {
                clearCart();
            }
            return response.data;
        } catch (error) {
            console.error("Error placing order:", error);
            return { success: false, message: "Connection error" };
        }
    };

    const listOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/list`);
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Error listing orders:", error);
        }
    };

    const toggleLike = async (itemId) => {
        if (!token) return alert("Please login to like items");

        // Optimistic update
        setLikedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);

        try {
            const response = await axios.post(`${url}/api/user/toggle-like`, { itemId }, { headers: { token } });
            if (response.data.success) {
                setLikedItems(response.data.likedItems);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await axios.post(`${url}/api/order/status`, { orderId, status });
            if (response.data.success) {
                await listOrders();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        loadCartData(userToken);
    };

    const logout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        setCartItems({});
    };

    return (
        <StoreContext.Provider value={{
            foodList, cartItems, likedItems, orders, user, token, isDark, url,
            addToCart, removeFromCart, clearCart, toggleLike,
            getCartTotal, getCartCount,
            placeOrder, fetchFoodList, listOrders, updateOrderStatus,
            login, logout,
            setIsDark,
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContext;
