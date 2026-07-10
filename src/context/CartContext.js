"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Load user on mount
  useEffect(() => {
    const localCredentials = localStorage.getItem("localCredentials");
    if (localCredentials) {
      try {
        const parsed = JSON.parse(localCredentials);
        if (parsed.email) {
          setUser(parsed);
        }
      } catch (err) {}
    }
  }, []);

  // Fetch cart when user is available
  useEffect(() => {
    if (user?.email) {
      fetchCart();
    }
  }, [user]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  
  const fetchCart = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/getMyCart", { email: user.email });
      if (response.data?.cart?.items) {
        setCartItems(response.data.cart.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user?.email) {
      toast.info("Please log in to add items to cart.");
      // Could trigger a login modal here instead
      return;
    }
    
    setLoading(true);
    try {
      const cartItem = {
        email: user.email,
        productId: product._id,
        quantity: quantity,
      };
      await axios.post("/api/addToCart", cartItem, {
        headers: { "Content-Type": "application/json" }
      });
      toast.success("Added to cart!");
      fetchCart(); // Refresh cart data
      setIsCartOpen(true); // Auto-open drawer
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.email) return;
    try {
      await axios.post("/api/removeFromCart", {
        email: user.email,
        productId: productId,
      });
      fetchCart();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user?.email) return;
    if (newQuantity < 1) return;
    
    try {
      await axios.put("/api/updateCartQuantity", {
        email: user.email,
        productId: productId,
        quantity: newQuantity,
      });
      fetchCart();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.productId?.price || 0) * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      loading,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      cartCount,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
