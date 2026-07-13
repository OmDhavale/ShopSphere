"use client";

import { use } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import LoadingIcons from "react-loading-icons";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ChevronRight, ChevronDown, Check, Star } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { useCart } from '@/context/CartContext';

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get("/api/getItems");
        if (response.data && Array.isArray(response.data.items)) {
          const items = response.data.items;
          const foundProduct = items.find((p) => p._id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
            // Get related products (same category, excluding this one)
            const related = items
              .filter(p => p.category === foundProduct.category && p._id !== productId)
              .slice(0, 4);
            setRelatedProducts(related);
          } else {
            toast.error("Product not found.");
          }
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingIcons.TailSpin stroke="#18181b" className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Link href="/products" className="text-blue-600 hover:underline">Return to Products</Link>
      </div>
    );
  }

  const originalPrice = product.price * 1.2;

  // Create mock gallery since DB only has one image
  const gallery = [product.image, product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <ToastContainer />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center text-sm text-gray-500 space-x-2">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-gray-900 transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Product Top Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">

          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto hide-scrollbar">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-zinc-900' : 'border-transparent hover:border-gray-200'
                    }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={activeImage}
              className="flex-1 bg-gray-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8 relative"
            >
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <div className="mb-6">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-sm text-gray-500 hover:underline cursor-pointer">128 Reviews</span>
              </div>
            </div>

            <div className="mb-8 flex items-end gap-4">
              <span className="text-4xl font-bold text-zinc-900">₹{product.price.toFixed(2)}</span>
              <span className="text-xl text-gray-400 line-through mb-1">₹{originalPrice.toFixed(2)}</span>
              <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded mb-2">
                {Math.ceil(((originalPrice - product.price) / originalPrice) * 100)}% OFF
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-white w-full sm:w-32 justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-500 hover:text-black focus:outline-none"
                >-</button>
                <span className="font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-gray-500 hover:text-black focus:outline-none"
                >+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-zinc-900 text-white font-semibold py-4 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-full sm:w-16 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors py-4 sm:py-0"
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Benefits */}
            <ul className="space-y-3 mb-10 pb-10 border-b border-gray-100">
              <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-5 h-5 text-green-500" /> Free shipping on orders over ₹50</li>
              <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-5 h-5 text-green-500" /> 30-day return policy</li>
              <li className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-5 h-5 text-green-500" /> Secure checkout</li>
            </ul>

            {/* Accordions */}
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex justify-between items-center font-semibold text-lg text-gray-900 focus:outline-none"
                >
                  Description
                  <ChevronDown className={`w-5 h-5 transition-transform ${activeAccordion === 'description' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'description' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 text-gray-600 leading-relaxed"
                  >
                    {product.description}
                  </motion.div>
                )}
              </div>

              <div className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleAccordion('specs')}
                  className="w-full flex justify-between items-center font-semibold text-lg text-gray-900 focus:outline-none"
                >
                  Specifications
                  <ChevronDown className={`w-5 h-5 transition-transform ${activeAccordion === 'specs' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'specs' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 text-gray-600"
                  >
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Category: {product.category}</li>
                      <li>ID: {product._id}</li>
                      <li>Quality Assured</li>
                      <li>1 Year Manufacturer Warranty</li>
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <ProductCard key={related._id} product={related} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
