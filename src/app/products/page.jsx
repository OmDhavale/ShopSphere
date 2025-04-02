// app/products/page.jsx
"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import axios from 'axios';
// import BuyComponent from '../product/[id]/BuyComponent'; // Import the BuyComponent
export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter(); // Initialize useRouter
  const [productToBuy, setProductToBuy] = useState({});
  // Static product data (replace with database fetch later)
  // const products = [
  //   { id: 1, name: 'Modern Desk Lamp', category: 'lighting', price: 49.99, imageUrl: '/product1.jpg' },
  //   { id: 2, name: 'Comfortable Wireless Headphones', category: 'electronics', price: 129.99, imageUrl: '/product2.jpg' },
  //   { id: 3, name: 'Minimalist Backpack', category: 'accessories', price: 79.99, imageUrl: '/product3.jpg' },
  //   { id: 4, name: 'Stylish Coffee Maker', category: 'appliances', price: 89.99, imageUrl: '/product1.jpg' },
  //   { id: 5, name: 'Ergonomic Office Chair', category: 'furniture', price: 249.99, imageUrl: '/product2.jpg' },
  //   { id: 6, name: 'Smart Watch', category: 'electronics', price: 199.99, imageUrl: '/product3.jpg' },
  //   // Add more products as needed
  // ];
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories,setCategories] = useState(null);
   //Fetching product data
  const [products, setProducts] = useState([]);
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get("/api/getItems");
          console.log(response.data.items);
          if (Array.isArray(response.data.items)) {
            setProducts(response.data.items);
            setCategories(response.data.items.map((item) => item.category));
          } else {
            console.log("API response is not an array", response.data);
          }
        } catch (err) {
          console.log("Error fetching products", err);
        }
      };
      fetchProducts();
    }, []);

  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const filterMatch = filter === 'all' || product.category === filter;
    return searchMatch && filterMatch;
  });

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);
  
  const localCredentials = localStorage.getItem("localCredentials");
  //convert localCredentials to JSON object
  const parsedCredentials = JSON.parse(localCredentials);
  // Static user data (replace with actual user data later)
  const user = {
    username: parsedCredentials.username,
    email: parsedCredentials.email,
  };

  const handleAddToCart = (productId) => {
    // Implement your add to cart logic here
    console.log(`Product ${productId} added to cart`);
    // You might want to use a state management solution or context API
    // to manage the cart state.
  };

  const handleBuyNow = (product) => {
    // Implement your buy now logic here
    console.log(product);
    // return (
    // <div>
    //   <BuyComponent
    //   image={product.image}
    //   name={product.name}
    //   category={product.category}
    //   description={product.description}
    //   price={product.price}
    // />
    // </div>
    // );
    // Redirect to the buy component with the selected product details
    router.push({
      pathname: `/product/${product._id}`,
      query: {
        image: product.image,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
      },
    });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  }
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };
  const handleLogout = () => {
    // Clear local storage and redirect to login page
    localStorage.removeItem("localCredentials");
    router.push("/"); // Redirect to the account page after logout
  } 
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <header className="py-8 px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-semibold text-white">
            Hello {parsedCredentials.username} !
          </a>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl py-2 px-3 focus:outline-none text-white "
              style={{ backgroundColor: "rgba(0, 0, 0, 0.23)" }}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className=" rounded-xl py-2 px-3 focus:outline-none text-white appearance-none" // Added appearance-none
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.23)",
              }}
            >
              {/* <div 
                className="text-black rounded-md overflow-hidden" // Container with gradient and white text
                style={{ 
                  background: 'linear-gradient(to right, #8B5CF6, #EC4899)', // Gradient background
                }} 
              >*/}
              {/* code for showing the categories as options but now fetched data items */}
              <option value="all" className="p-2 block hover:bg-purple-700/50">
                All
              </option>
              {categories &&
                categories.map((category, index) => (
                  <option
                    key={category}
                    value={category}
                    className="p-2 block hover:bg-purple-700/50"
                  >
                    {category}
                  </option>
                ))}
              {/* <option
                value="lighting"
                className="p-2 block hover:bg-purple-700/50"
              >
                Lighting
              </option>
              <option
                value="electronics"
                className="p-2 block hover:bg-purple-700/50"
              >
                Electronics
              </option>
              <option
                value="accessories"
                className="p-2 block hover:bg-purple-700/50"
              >
                Accessories
              </option>
              <option
                value="appliances"
                className="p-2 block hover:bg-purple-700/50"
              >
                Appliances
              </option>
              <option
                value="furniture"
                className="p-2 block hover:bg-purple-700/50"
              >
                Furniture
              </option> */}
              {/* </div> */}
            </select>

            <div className="relative">
              <button onClick={toggleUserMenu} className="focus:outline-none">
                <svg
                  className="h-8 w-8 rounded-full bg-gray-300 fill-white" // Replace with user logo later
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 12c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6z" />
                </svg>
              </button>

              <div
                ref={userMenuRef}
                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden transition-transform duration-300 ease-in-out ${
                  isUserMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0 pointer-events-none"
                }`}
              >
                <div className="py-2">
                  <p className="block px-4 py-2 text-gray-800">
                    {user.username}
                  </p>
                  <p className="block px-4 py-2 text-gray-600">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, _id) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600">Category: {product.category}</p>
                <p className="text-gray-600 font-semibold">
                  ₹{product.price.toFixed(2)}
                </p>
              </div>
              <div className="p-4">
                <div className="flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product._id);
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProductToBuy(product);
                      handleBuyNow(product);
                      
                    }}
                    className="w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal Overlay */}
      {selectedProduct && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl text-gray-600 font-semibold mb-4">
              {selectedProduct.name}
            </h2>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              width={500}
              height={300}
              className="w-full h-full object-cover mb-4 rounded-md"
            />
            <p className="text-gray-600 mb-2">
              Category: {selectedProduct.category}
            </p>
            <p className="text-gray-600 font-semibold mb-4">
              ₹{selectedProduct.price.toFixed(2)}
            </p>
            <p className="text-gray-700 mb-4">
              {/* Replace with your product description */}
              {selectedProduct.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-2">
              <button
                onClick={() => handleAddToCart(selectedProduct.id)}
                className="w-full sm:w-1/2 mb-2 sm:mb-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(selectedProduct.id)}
                className="w-full sm:w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

