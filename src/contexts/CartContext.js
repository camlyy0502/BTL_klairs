import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ address_id: '', orders: [] });
    const [cartLength, setCartLength] = useState(0);

    // Load cart from localStorage when component mounts
    useEffect(() => {
        const storedCart = localStorage.getItem('klairs_cart');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            setCart(parsedCart);
            setCartLength(parsedCart.orders.length);
        }
    }, []);

    const updateCart = (newCart) => {
        setCart(newCart);
        setCartLength(newCart.orders.length);
        localStorage.setItem('klairs_cart', JSON.stringify(newCart));
    };

    const calculateTotal = () => {
        return cart.orders.reduce((total, item) => {
            const price = item.sale > 0 ? item.product_price_sale : item.product_price;
            return total + (price * item.quantity);
        }, 0);
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            updateCart, 
            cartLength,
            calculateTotal 
        }}>
            {children}
        </CartContext.Provider>
    );
};
