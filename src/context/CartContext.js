"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

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
      setShowLoginPrompt(true);
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
      await axios.delete("/api/removeFromCart", {
        data: {
          email: user.email,
          productId: productId,
        }
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
      setIsCartOpen,
      user,
      setUser
    }}>
      {children}
      
      {/* Global Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Login Required
            </h2>
            <p className="mb-8 text-gray-600 text-center">
              Please log in to your account to add items to your cart and proceed to checkout.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  router.push("/account");
                }}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none transition-colors"
              >
                Proceed to Login
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
