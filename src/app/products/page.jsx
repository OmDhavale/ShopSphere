// app/products/page.jsx
"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Static product data (replace with database fetch later)
  const products = [
    { id: 1, name: 'Modern Desk Lamp', category: 'lighting', price: 49.99, imageUrl: '/product1.jpg' },
    { id: 2, name: 'Comfortable Wireless Headphones', category: 'electronics', price: 129.99, imageUrl: '/product2.jpg' },
    { id: 3, name: 'Minimalist Backpack', category: 'accessories', price: 79.99, imageUrl: '/product3.jpg' },
    { id: 4, name: 'Stylish Coffee Maker', category: 'appliances', price: 89.99, imageUrl: '/product1.jpg' },
    { id: 5, name: 'Ergonomic Office Chair', category: 'furniture', price: 249.99, imageUrl: '/product2.jpg' },
    { id: 6, name: 'Smart Watch', category: 'electronics', price: 199.99, imageUrl: '/product3.jpg' },
    // Add more products as needed
  ];

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

  // Static user data (replace with actual user data later)
  const user = {
    username: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <header className="py-8 px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/"className="text-2xl font-semibold text-white">ShopSphere</a>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded py-2 px-3 focus:outline-none text-white"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded py-2 px-3 focus:outline-none text-black"
            >
              <option value="all">All</option>
              <option value="lighting">Lighting</option>
              <option value="electronics">Electronics</option>
              <option value="accessories">Accessories</option>
              <option value="appliances">Appliances</option>
              <option value="furniture">Furniture</option>
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
                  isUserMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
                }`}
              >
                <div className="py-2">
                  <p className="block px-4 py-2 text-gray-800">{user.username}</p>
                  <p className="block px-4 py-2 text-gray-600">{user.email}</p>
                  <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
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
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src={product.imageUrl} alt={product.name} width={500} height={300} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                <p className="text-gray-600">Category: {product.category}</p>
                <p className="text-gray-600 font-semibold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

