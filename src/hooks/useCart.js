import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'

const useCart = () => {
    // Configuration of the initial state of the cart
    const initialState = () => {
        const cartString = localStorage.getItem('cart');
        return cartString ? JSON.parse(cartString) : [];
    }

    const [data] = useState(db); //read guitars from db
    const [cart, setCart] = useState(initialState);
    const MAX_ITEMS = 10;

    useEffect(() => {
        saveInLocalStorage();
    }, [cart]);

    // Functions to manage the cart
    function addToCart(item) {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
        if (itemExists >= 0) {
            const newCart = [...cart];
            newCart[itemExists].quantity++;
            setCart(newCart);
        } else {
            item.quantity = 1;
            setCart(prevCart => [...prevCart, item]);
        }
    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter((guitar) => guitar.id !== id));
    }

    function increaseQuantity(id) {
        const updatedCart = cart.map((guitar) => {
            if (guitar.id === id) {
                if (guitar.quantity >= MAX_ITEMS) {
                    alert(`No puedes agregar más de ${MAX_ITEMS} unidades`);
                    return guitar;
                }
                return { ...guitar, quantity: guitar.quantity + 1 };
            }
            return guitar;
        });
        setCart(updatedCart);
    }

    function decreaseQuantity(id) {
        const updatedCart = cart.map((guitar) => {
            if (guitar.id === id && guitar.quantity > 1) {
                return { ...guitar, quantity: guitar.quantity - 1 };
            }
            return guitar;
        });
        setCart(updatedCart);
    }

    function clearCart() {
        setCart([]);
    }

    function saveInLocalStorage() {
        const cartString = JSON.stringify(cart);
        localStorage.setItem('cart', cartString);
    }

    // State derivado de props
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);

    return {
        data,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        MAX_ITEMS,
        isEmpty,
        cartTotal,
    };
}

export default useCart;