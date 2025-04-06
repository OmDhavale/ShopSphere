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
    //check if the localStorage has the credentials or not
    const localCredentials = localStorage.getItem("localCredentials");
    if (localCredentials == null) {
      setShowLoginPrompt(true); // Show the login prompt
    } else {
      // Redirect to the products page
      router.push("/products");
    }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative">
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-semibold text-gray-800">
            ShopSphere
          </a>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.829-4.828 4.829a1 1 0 0 1-1.414-1.414l4.829-4.828-4.829-4.828a1 1 0 1 1 1.414-1.414l4.828 4.829 4.829-4.829a1 1 0 1 1 1.414 1.414l-4.828 4.828 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
                  />
                )}
              </svg>
            </button>
          </div>

          <nav
            className={`md:flex space-x-4 ${
              isMenuOpen ? "hidden" : "hidden md:flex"
            }`}
          >
            <a
              onClick={handleShopNowClick}
              className="text-gray-600 hover:text-gray-900"
            >
              Products
            </a>
            <a href="/categories" className="text-gray-600 hover:text-gray-900">
              Categories
            </a>
            <a href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart
            </a>
            <a href="/account" className="text-gray-600 hover:text-gray-900">
              Account
            </a>
          </nav>
        </div>
      </header>

      {/* Sidebar for mobile view */}
      {/* Added ref to the sidebar div */}
      <div
        ref={sidebarRef} // Add the ref to the sidebar div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-4">
          <nav className="flex flex-col space-y-4 ">
            <a
              onClick={handleShopNowClick}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Products
            </a>
            <a
              href="/categories"
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Categories
            </a>
            <a
              href="/cart"
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Cart
            </a>
            <a
              href="/account"
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Account
            </a>
          </nav>
        </div>
      </div>

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
            Discover Your Next Favorite Thing.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore our curated collection of high-quality products, handpicked
            for style and functionality.
          </p>
          <a
            onClick={handleShopNowClick}
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-500 hover:to-purple-500 hover:shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-500 ease-in-out"
          >
            Shop Now
          </a>
        </div>

        {!loading ? (
          <>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product, _id) => (
                <ProductCard
                  key={_id}
                  image={product.image}
                  name={product.name}
                  category={product.category}
                  description={product.description}
                  price={product.price}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row w-full items-center justify-center space-x-4 pt-10">
              {/* <p className="text-2xl text-black">
                  Loading product details...
                </p> */}
              <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
              <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
              <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
            </div>
          </>
        )}

        {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src="/product1.jpg"
              alt="Product 1"
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Comfortable Wireless Headphones
              </h2>
              <p className="text-gray-600">electronics</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src="/product1.jpg"
              alt="Product 1"
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Minimalist Backpack
              </h2>
              <p className="text-gray-600">accessories</p>
            </div>
          </div>
         
        </div> */}
        {/* ... (rest of the main content) ... */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Featured Categories
          </h2>
          <div className="flex justify-center space-x-8">
            <a
              href="/categories/electronics"
              className="text-gray-600 hover:text-gray-900"
            >
              Electronics
            </a>
            <a
              href="/categories/clothing"
              className="text-gray-600 hover:text-gray-900"
            >
              Clothing
            </a>
            <a
              href="/categories/home-goods"
              className="text-gray-600 hover:text-gray-900"
            >
              Home Goods
            </a>
          </div>
        </div>
      </main>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
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
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" //w-full added.
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