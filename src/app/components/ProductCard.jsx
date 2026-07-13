"use client";

import { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Simulate a discount for display purposes if not provided by backend
  const originalPrice = product.price * 1.2;
  const discountPercent = Math.ceil(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div 
      className="bg-white border border-gray-200 p-6 group cursor-pointer flex flex-col h-full hover:border-gray-300 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product._id}`} className="block relative w-full aspect-square bg-gray-50 mb-4 overflow-hidden border border-gray-100/50">
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-500 text-white text-[10px] px-2 py-1 uppercase tracking-tighter font-semibold">
            Save {discountPercent}%
          </span>
        </div>
        
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-6 transition-transform duration-500 ease-out"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
      </Link>

      <div className="flex-grow flex flex-col">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{product.category}</span>
        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-gray-600 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-4">
          <Star className="text-yellow-500 fill-yellow-500" size={14} />
          <span className="text-sm text-gray-700">4.8</span>
          <span className="text-xs text-gray-400 ml-1">(124)</span>
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-auto">
        <div>
          <p className="text-xs text-gray-400 line-through mb-0.5">₹{originalPrice.toFixed(2)}</p>
          <p className="text-lg font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
        </div>
        <button 
          onClick={handleAddToCart}
          className="p-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded-sm"
          title="Add to cart"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;