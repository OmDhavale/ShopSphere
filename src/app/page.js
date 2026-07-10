// app/page.jsx
"use client";
import { Skeleton } from "@/components/ui/skeleton"

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react'; // Added useRef and useEffect
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ProductCard from './components/ProductCard'; // Import the ProductCard component
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sidebarRef = useRef(null); // Create a ref for the sidebar
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // State for login prompt
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading ] = useState(true); // State for loading


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/getItems");
        console.log(response.data.items);
        if (Array.isArray(response.data.items)) {
          setProducts(response.data.items);
          setLoading(false); // Set loading to false after fetching products
        } else {
          console.log("API response is not an array", response.data);
        }
      } catch (err) {
        console.log("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  // Log `products` in another `useEffect` to see the updated state
  useEffect(() => {
    console.log("Updated Products:", products);
  }, [products]);

  const handleShopNowClick = () => {
    router.push("/products");
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false); // Close the prompt
    router.push("/account"); // Redirect to the account page
  };

  const handleClosePrompt = () => {
    setShowLoginPrompt(false);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close the sidebar
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside); // Use mousedown for better user experience
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 relative">


      <main className="w-full">
        {/* HERO SECTION (Discovery Optimized) */}
        <section className="bg-zinc-900 text-white py-24 px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center min-h-[500px]">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              Curated collections designed for performance and aesthetic clarity.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              Explore our curated collection of high-quality products, handpicked for style and functionality.
            </p>
            <div className="pt-4 flex justify-center">
              <a
                onClick={handleShopNowClick}
                className="inline-block bg-white text-zinc-900 font-semibold py-4 px-10 rounded-md hover:bg-zinc-100 hover:-translate-y-1 cursor-pointer transition-all duration-300"
              >
                Explore Collection
              </a>
            </div>
          </div>
        </section>

        {/* QUICK CATEGORY LINKS (Utility Optimized) */}
        <section className="py-12 border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Continue Browsing</h3>
            <div className="flex flex-wrap gap-4">
              {['Pro Keyboards', 'Audio Gear', 'Peripherals', 'Workstations'].map((category) => (
                <a
                  key={category}
                  href={`/products?category=${category}`}
                  className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  {category}
                </a>
              ))}
              <a
                onClick={handleShopNowClick}
                className="px-6 py-3 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer ml-auto"
              >
                View History &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* DASHBOARD BLOCK & TOP DEALS */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* User Dashboard Mini */}
            <div className="lg:col-span-1 bg-white p-8 rounded-lg border border-gray-200 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome back.</h3>
                <p className="text-gray-600 mb-6">
                  You have <span className="font-semibold text-zinc-900">4,250 Sphere points</span> available to spend.
                </p>
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-md">
                  <h4 className="font-semibold text-zinc-900 mb-1">Sphere+ Perks</h4>
                  <p className="text-sm text-gray-500 mb-3">Unlimited same-day delivery and priority support.</p>
                  <a href="#" className="text-sm font-medium text-zinc-900 hover:underline">Learn More &rarr;</a>
                </div>
              </div>
              <a onClick={handleShopNowClick} className="mt-8 inline-block w-full text-center bg-zinc-900 text-white py-3 rounded-md hover:bg-zinc-800 cursor-pointer transition-colors">
                Redeem Points
              </a>
            </div>

            {/* Top Deals */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Top Deals for You</h3>
                <a onClick={handleShopNowClick} className="text-sm font-medium text-zinc-900 hover:underline cursor-pointer">View All &rarr;</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: "Leather Tech Sleeve", price: "$89.00", oldPrice: "$112.00", image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2009&auto=format&fit=crop" },
                  { name: "Precision Brewer", price: "$145.00", oldPrice: "$170.00", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=1964&auto=format&fit=crop" },
                  { name: "Slim Charge Pro", price: "$49.00", oldPrice: "$70.00", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1988&auto=format&fit=crop" },
                ].map((deal, idx) => (
                  <div key={idx} className="bg-white group rounded-md overflow-hidden border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="h-40 bg-gray-100 overflow-hidden relative">
                      {/* Placeholder images based on realistic unsplash URLs to look premium */}
                      <img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded">SALE</div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1">{deal.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-zinc-900">{deal.price}</span>
                        <span className="text-sm text-gray-400 line-through">{deal.oldPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* NEW ARRIVALS (Refactored to match) */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-3xl font-bold text-gray-900">New Arrivals</h3>
              <a onClick={handleShopNowClick} className="text-sm font-medium text-zinc-900 hover:underline cursor-pointer">Shop All Products &rarr;</a>
            </div>
            
            {!loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product, _id) => (
                  <div key={_id} className="group bg-white border border-gray-200 rounded-md overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="h-56 bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
                       <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                      <h4 className="font-medium text-gray-900 mb-2 truncate">{product.name}</h4>
                      <p className="font-semibold text-zinc-900">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-md overflow-hidden">
                     <Skeleton className="h-56 w-full rounded-none bg-gray-100" />
                     <div className="p-4">
                       <Skeleton className="h-3 w-16 mb-2 bg-gray-200" />
                       <Skeleton className="h-4 w-3/4 mb-3 bg-gray-200" />
                       <Skeleton className="h-4 w-1/4 bg-gray-200" />
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SUSTAINABILITY BLOCK */}
        <section className="bg-zinc-50 border-t border-b border-gray-200 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable Packaging</h3>
            <p className="text-gray-600">
              We've eliminated 95% of plastic from our shipping chain. Shop responsibly.
            </p>
          </div>
        </section>
      </main>

      {/* COMPREHENSIVE FOOTER */}
      <footer className="bg-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Get to Know Us</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">About ShopSphere</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Make Money with Us</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Sell products</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Affiliate Program</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Advertise Your Products</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Payment Products</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Sphere Rewards Visa</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Store Card</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Currency Converter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Let Us Help You</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="/account" className="hover:text-zinc-900 transition-colors">Your Account</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Shipping Rates</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Returns & Replacements</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-900 transition-colors">Conditions of Use</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Notice</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Interest-Based Ads</a>
          </div>
        </div>
      </footer>

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
            {" "}
            {/* Added w-full max-w-md */}
            <h2 className="text-2xl font-semibold  text-gray-900 mb-6 text-center">
              Login Required
            </h2>{" "}
            {/* Added text-center */}
            <p className="mb-8  text-gray-900  text-center">
              Please log in to your account to continue.
            </p>{" "}
            {/* Added text-center */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {" "}
              {/* Changed flex layout */}
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors" //w-full added.
              >
                Login
              </button>
              <button
                onClick={handleClosePrompt}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded" //w-full added.
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}