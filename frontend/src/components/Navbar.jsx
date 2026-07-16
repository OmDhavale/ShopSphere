"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, toggleCart, user, setUser } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    if (val.trim() !== '') {
      router.push(`/products?search=${encodeURIComponent(val)}`);
    } else {
      router.push(`/products`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("localCredentials");
    if (setUser) setUser(null);
    router.push("/");
  };

  const name = user?.name || (user?.email ? user.email.split('@')[0] : "John Doe");
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm py-3"
            : "bg-white border-b border-gray-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold tracking-tight text-zinc-900">
                ShopSphere<span className="text-blue-600">.</span>
              </Link>
            </div>

            {/* Desktop Navigation & Search */}
            <div className="hidden md:flex flex-1 items-center justify-center px-8">
              <nav className="flex space-x-8 mr-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-zinc-900 ${
                      pathname === link.href ? "text-zinc-900" : "text-gray-500"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="max-w-md w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/wishlist" className="text-gray-400 hover:text-zinc-900 transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
              {user ? (
                <div className="relative group">
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors focus:outline-none">
                    {initials}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-4 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2 flex flex-col">
                      <Link href="/account" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left">My Profile</Link>
                      <Link href="/orders" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left">Orders</Link>
                      <Link href="/settings" className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left">Settings</Link>
                    </div>
                    <div className="p-2 border-t border-gray-50">
                      <button onClick={handleLogout} className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors text-left">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/account" className="text-gray-400 hover:text-zinc-900 transition-colors">
                  <User className="h-5 w-5" />
                </Link>
              )}
              <button onClick={toggleCart} className="text-gray-400 hover:text-zinc-900 transition-colors relative cursor-pointer focus:outline-none">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-4">
              <button onClick={toggleCart} className="text-gray-400 hover:text-zinc-900 transition-colors relative focus:outline-none">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-zinc-900 focus:outline-none p-1"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col space-y-4">
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900 sm:text-sm"
                />
              </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-gray-900 hover:text-blue-600"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 flex items-center space-x-6">
               <Link href="/wishlist" className="flex items-center text-sm font-medium text-gray-500 hover:text-zinc-900">
                <Heart className="h-5 w-5 mr-2" /> Wishlist
              </Link>
              {user ? (
                <div className="flex flex-col w-full">
                  <div className="flex items-center space-x-3 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-200 text-zinc-900 font-medium">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/account" className="flex items-center text-sm font-medium text-gray-500 hover:text-zinc-900 py-2">
                    My Profile
                  </Link>
                  <Link href="/orders" className="flex items-center text-sm font-medium text-gray-500 hover:text-zinc-900 py-2">
                    Orders
                  </Link>
                  <Link href="/settings" className="flex items-center text-sm font-medium text-gray-500 hover:text-zinc-900 py-2">
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 py-2 text-left mt-2">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/account" className="flex items-center text-sm font-medium text-gray-500 hover:text-zinc-900">
                  <User className="h-5 w-5 mr-2" /> Account
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Spacer to prevent content from jumping due to fixed header */}
      <div className="h-16 md:h-20"></div>
    </>
  );
}
