"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import LoadingIcons from "react-loading-icons";

const CartDrawer = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <ShoppingBag className="w-16 h-16 mb-4 text-gray-200" />
                  <p>Your cart is empty.</p>
                  <button 
                    onClick={toggleCart}
                    className="mt-4 text-blue-600 font-medium hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => item.productId && (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100 p-1"
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.productId.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.productId._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm mb-auto line-clamp-1">{item.productId.category}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || loading}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="px-2 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                            disabled={loading}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-semibold text-gray-900">
                          ₹{(item.productId.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-4 text-gray-900">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-xl">₹{cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6 text-center">Shipping and taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={toggleCart}>
                  <button className="w-full bg-zinc-900 text-white font-semibold py-4 rounded-xl hover:bg-zinc-800 transition-colors shadow-lg">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
            
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                 <LoadingIcons.TailSpin stroke="#18181b" className="w-8 h-8 animate-spin" />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
