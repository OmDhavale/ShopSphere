"use client";

import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Simulate a discount for display purposes if not provided by backend
  const originalPrice = product.price * 1.2;
  const discountPercent = Math.ceil(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges & Actions overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <div className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded">
          {discountPercent}% OFF
        </div>
      </div>
      
      <div className="absolute top-3 right-3 z-10">
        <button 
          onClick={handleWishlist}
          className="p-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm hover:bg-red-50 transition-colors"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
      </div>

      <Link href={`/products/${product._id}`} className="block relative h-64 bg-gray-50 overflow-hidden flex-shrink-0">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-6"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        
        {/* Quick Add Overlay */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
        >
          <button 
            onClick={handleAddToCart}
            className="w-full bg-zinc-900 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>
        </motion.div>
      </Link>

      <div className="p-5 flex flex-col flex-grow border-t border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">{product.category}</p>
          {/* Static rating for mockup purposes */}
          <div className="flex items-center text-yellow-400 text-xs">
            ★ <span className="text-gray-500 ml-1">4.8</span>
          </div>
        </div>
        
        <Link href={`/products/${product._id}`} className="block group-hover:text-blue-600 transition-colors">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
        </Link>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-zinc-900">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-400 line-through ml-2">${originalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;