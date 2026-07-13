// app/products/page.jsx
"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton"

import { toast, ToastContainer } from "react-toastify";
import LoadingIcons from "react-loading-icons";

import EditProductForm from '../components/EditProductForm';
import ProductCard from '../components/ProductCard';
import { LayoutGrid, MonitorSmartphone, Shirt, Home, PenTool, Dumbbell, Sparkles, Tag } from 'lucide-react';

const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('electronic') || cat.includes('tech') || cat.includes('audio')) return <MonitorSmartphone size={24} />;
  if (cat.includes('fashion') || cat.includes('apparel') || cat.includes('clothing')) return <Shirt size={24} />;
  if (cat.includes('home') || cat.includes('lifestyle')) return <Home size={24} />;
  if (cat.includes('stationery') || cat.includes('creative') || cat.includes('book')) return <PenTool size={24} />;
  if (cat.includes('sport') || cat.includes('fitness')) return <Dumbbell size={24} />;
  if (cat.includes('beauty') || cat.includes('cosmetic')) return <Sparkles size={24} />;
  return <Tag size={24} />;
};

// import BuyComponent from '../product/[id]/BuyComponent'; // Import the BuyComponent
export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');  //for search filter
  const [filter, setFilter] = useState('all');  // for category filter  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);  // for user credentials menu - desktop page
  const userMenuRef = useRef(null);
  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams();
  const [productToBuy, setProductToBuy] = useState({});
  const [user, setUser] = useState({});   //for storing user credentials from local storage
  const [selectedProduct, setSelectedProduct] = useState(null); //for showing description of selected product  const [categories,setCategories] = useState(null);
  
  useEffect(() => {
    if (searchParams) {
      const q = searchParams.get('search');
      if (q !== null) {
        setSearchTerm(q);
      } else {
        setSearchTerm('');
      }
    }
  }, [searchParams]);
   //Fetching product data
  const [ loading, setLoading] = useState(true) //loading state of products skeleton
  const [buttonLoading, setButtonLoading] = useState(false) 
  const [products, setProducts] = useState([]); // for storing fetched products
  const [categories, setCategories] = useState([]);
  const [adminLogin, setAdminLogin ] = useState("user") // for admin login status
  const [editingProduct, setEditingProduct] = useState(null); //for editing page --only for admin
  const [isEditing, setIsEditing] = useState(false);  //for editing page --only for admin
  const [cartItems, setCartItems] = useState([]); //for cart items
  const [showCart, setShowCart] = useState("false"); //for cart visibility
const [isMenuOpen, setIsMenuOpen] = useState(false); //for mobile side menu visibility
 const starColor = "orange"; //star of ratings
  // Random rating between 0 and 5
const [rating, setRating] = useState(3); //gave 3 stars initially to all products
 const sidebarRef = useRef(null);

 const handleStarClick = (selectedRating) => {
   setRating(selectedRating);
 };

 const toggleMenu = () => {
   setIsMenuOpen(!isMenuOpen);
 };
  
  //  const localCredentials = localStorage.getItem("localCredentials");
  // //convert localCredentials to JSON object
  // const parsedCredentials = JSON.parse(localCredentials);
      const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
// console.log("adminCredentials: ",adminEmail, adminUsername) //comment
// console.log("localCredentials: ",parsedCredentials.email, parsedCredentials.username) //comment
 
  // Static user data (replace with actual user data later)
  //comment out this
  // const user = {
  //   username: parsedCredentials.username,
  //   email: parsedCredentials.email,
  // };
// useEffect(() => {
//   // Access localStorage only in the browser
//   const localCredentials = localStorage.getItem("localCredentials");
//   if (localCredentials) {
//     const parsedCredentials = JSON.parse(localCredentials);
//     const user = {
//       username: parsedCredentials.username,
//       email: parsedCredentials.email,
//     };
//     setUser(user);
//   }
// }, []);
useEffect(() => {
  const localCredentials = localStorage.getItem("localCredentials");
  if (localCredentials) {
    try {
      const parsedCredentials = JSON.parse(localCredentials);
      console.log("parsed: ",parsedCredentials.username, parsedCredentials.email)
      // Safety check in case parsed result is invalid
      if (parsedCredentials?.username && parsedCredentials?.email) {
        // const user = {
        //   email: parsedCredentials.email,
        //   username: parsedCredentials.username,  
        // };
        setUser({
          email: parsedCredentials.email,
          username: parsedCredentials.username,
        }); 
      } else {
        console.log("Parsed credentials are missing username or email");
      }
    } catch (err) {
      console.log("Failed to parse localCredentials:", err);
    }
  } else {
    console.log("No localCredentials found in localStorage");
  }
}, []);

    useEffect(() => {

      const fetchProducts = async () => {
          //console.log(user.email, user.username, adminEmail, adminUsername)
          if(user.email && adminEmail && user.email === adminEmail && user.username === adminUsername){
              console.log("Admin logged in successfully");
              setAdminLogin("admin")
            } else {
              setAdminLogin("user")
            }

        try {

          const response = await axios.get("/api/getItems");
          console.log(response.data.items);
          if (Array.isArray(response.data.items)) {
            setProducts(response.data.items);
            setCategories(response.data.items.map((item) => item.category));
            setLoading(false);
          } else {
            console.log("API response is not an array", response.data);
          }
        } catch (err) {
          console.log("Error fetching products", err);
        }
      };
      fetchProducts();
    }, [user]);

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
  
 
  // const handleAddToCart = (productId) => {
  //   // Implement your add to cart logic here
  //   console.log(`Product ${productId} added to cart`);
  //   // You might want to use a state management solution or context API
  //   // to manage the cart state.
  // };
const [loadingId, setLoadingId] = useState(null);
const [addcartLoadingId, setAddCartLoadingId] = useState(null);
const [deleteLoadingId, setDeleteLoadingId] = useState(null);
const [editLoadingId, setEditLoadingId] = useState(null);

  const handleBuyNow = (product) => {
    // Implement your buy now logic here

//     console.log(product);
// console.log(typeof product._id, product._id);
console.log("Navigating to:", `/product/${product._id}`);
setLoadingId(product._id);
    //setButtonLoading(true)
    console.log(buttonLoading)
    router.push(`/product/${product._id}`);
  };
const handleBuyNowCart = (items) =>{
  console.log("Navigating to:", `/product/${items.productId._id}`);
  setLoadingId(items.productId._id);
  //setButtonLoading(true)
  console.log(buttonLoading);
  router.push(`/product/${items.productId._id}`);
}
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  }
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };
  const handleCloseCart = () => {
    
    setShowCart("false");
  };
  const handleLogout = () => {
    // Clear local storage and redirect to login page
    localStorage.removeItem("localCredentials");
    router.push("/"); // Redirect to the account page after logout
  } 
  const handleCreate = () =>{
    router.push("/admin/createItem")
  }
  const handleDelete = (product) => {
    console.log(product._id)
    const reqBody = { _id: product._id };
    console.log(reqBody)
    setDeleteLoadingId(product._id);
    axios.post("/api/deleteItem",reqBody,{
      headers:{
        "Content-Type":"application/json",
      }
    }).then((response)=>{
      console.log("Item deleted :", response.data);
      toast.success("Item deleted successfully!");
      setDeleteLoadingId(null);
      //refresh page after this..
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000 milliseconds = 2 second
    }).catch((error)=>{
      console.log("ERROR DELETING ITEM",error);
      toast.error("Item deletion failed");
    })  
  }


  const handleEdit = (product) => {
    setEditLoadingId(product._id);
    console.log("Editing product:", product);
    setEditingProduct(product);
    setIsEditing(true);
  };


 const addToCart = (product) => {
   console.log("Product to be added: ", product);
   const cartItem = {
     email: user.email, // or userId if you store it
     productId: product._id,
     quantity: 1, // default quantity
   };
   setAddCartLoadingId(product._id);
   axios
     .post("/api/addToCart", cartItem, {
       headers: {
         "Content-Type": "application/json",
       },
     })
     .then((response) => {
       console.log("Item added to cart: ", response.data);
       toast.success("Item added to cart successfully!");
        setAddCartLoadingId(null);
     })
     .catch((error) => {
       console.log("ERROR ADDING ITEM TO CART", error);
       const errMsg =
         error?.response?.data?.message || "Item addition to cart failed";
       toast.error(errMsg);
     });
 };


 const fetchCart = async () => {
  try {
    axios
      .post("/api/getMyCart", {
        // email: parsedCredentials.email,
        email: user.email,
      })
      .then((res) => {
        console.log("Cart items:", res.data.cart.items);

        setCartItems(res.data.cart.items);
        setShowCart("true");
        console.log(showCart);
        console.log(cartItems.length);
        // toast.success("Cart loaded successfully!");
      })
      .catch((err) => {
        toast.error("Failed to load cart", err);
      });

  } catch (err) {
    toast.error("Failed to load cart");
  }
};
const [removeCartLoadingId, setRemoveCartLoadingId] = useState(null);
  const handleRemoveFromCart = (productId) => {
    const prodId = productId._id;
    // const email = parsedCredentials.email;
    const email = user.email;
    console.log("Removing product from cart:", prodId, email);
    const reqBody = { email, productId: prodId };
    setRemoveCartLoadingId(productId._id);
    axios.delete("/api/removeFromCart", {
      data: reqBody,
    })
      .then((response) => {
        console.log("Item removed from cart:", response.data);
        toast.success("Item removed from cart successfully!");
        // Refresh the cart items after removal
        setRemoveCartLoadingId(null);
        fetchCart();
      })
      .catch((error) => {
        console.log("ERROR REMOVING ITEM FROM CART", error);
        toast.error("Failed to remove item from cart");
      });


  }
  
  const updateCartQuantity = async (productId, newQuantity) => {
    try {
      axios.put("/api/updateCartQuantity", {
        // email: parsedCredentials.email,
        email: user.email,
        productId: productId,
        quantity: newQuantity,
      }).then((response)=>{
        // toast.success("Cart updated!");
        fetchCart();
        console.log(response.data.cart.items);
      }).catch((error)=>{
        console.error("Error updating cart quantity", error);
        toast.error("Failed to update quantity");
      });
    } catch (error) {
      console.error("Error updating cart quantity", error);
      toast.error("Failed to update quantity");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <nav className="flex text-sm text-gray-500 space-x-2">
          <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">Products</span>
        </nav>
      </div>

      {/* Horizontal Category Bar */}
      <div className="w-full bg-white border-y border-gray-200 sticky top-0 z-40 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex gap-8 items-center min-w-max">
            <button 
              onClick={() => setFilter('all')}
              className={`flex flex-col items-center gap-1 group transition-colors ${filter === 'all' ? 'text-zinc-900' : 'text-gray-400 hover:text-zinc-900'}`}
            >
              <LayoutGrid size={24} />
              <span className="text-sm font-medium">All</span>
            </button>
            {categories && [...new Map(categories.map(cat => [cat.toLowerCase(), cat])).values()].map((category, index) => (
              <button 
                key={index}
                onClick={() => setFilter(category)}
                className={`flex flex-col items-center gap-1 group transition-colors ${filter === category ? 'text-zinc-900' : 'text-gray-400 hover:text-zinc-900'}`}
              >
                {getCategoryIcon(category)}
                <span className="text-sm font-medium capitalize">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs font-semibold text-zinc-900 uppercase tracking-widest">Top Rated</span>
            <h2 className="text-2xl font-bold text-zinc-900 mt-1">Best Sellers</h2>
          </div>
          <a className="text-sm font-medium text-zinc-900 hover:underline flex items-center gap-1 cursor-pointer">
            View All &rarr;
          </a>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* We use a slice of filteredProducts for Best Sellers */}
          {filteredProducts.slice(0, 4).map(product => (
            <div key={`bs-${product._id}`} className="min-w-[280px] md:min-w-[320px] max-w-[320px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <main className="pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 overflow-auto">
        <ToastContainer />
        
        {/* Left Sidebar for Desktop Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 hidden lg:block space-y-8">


          <div>
            <h4 className="text-sm font-medium border-b border-gray-200 pb-2 mb-3">Availability</h4>
            <label className="flex items-center gap-2 mt-2 cursor-pointer group">
              <input type="checkbox" className="rounded-sm border-gray-300 text-zinc-900 focus:ring-zinc-900 h-4 w-4" defaultChecked />
              <span className="text-sm text-gray-700 group-hover:text-zinc-900">In Stock</span>
            </label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer group">
              <input type="checkbox" className="rounded-sm border-gray-300 text-zinc-900 focus:ring-zinc-900 h-4 w-4" />
              <span className="text-sm text-gray-700 group-hover:text-zinc-900">Pre-order</span>
            </label>
          </div>

          <div>
            <h4 className="text-sm font-medium border-b border-gray-200 pb-2 mb-3">Price Range</h4>
            <div className="mt-4 px-1">
              <input type="range" className="w-full accent-zinc-900 h-1 bg-gray-200 appearance-none rounded-full" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>₹0</span>
                <span>₹5,000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Product Area */}
        <div className="flex-1">
          {/* Top Control Bar */}
          <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-600">Showing <span className="font-bold text-zinc-900">{filteredProducts.length}</span> Products</p>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Sort By:</span>
              <select className="bg-transparent border-none text-sm font-medium text-zinc-900 focus:ring-0 cursor-pointer p-0">
                <option>Featured</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

        {!loading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {/* Display skeleton loaders if data is loading */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 mb-2 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-200 mb-2 w-1/2 rounded"></div>
                  <div className="h-4 bg-gray-200 mb-4 w-1/4 rounded"></div>
                  <div className="h-8 bg-gray-200 mb-4 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 w-full rounded-md mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>

      {isEditing && editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setIsEditing(false)}
          onUpdate={(updatedProduct) => {
            // update your products list state here if needed
            setIsEditing(false);
          }}
        />
      )}

      {/* Modal Overlay */}
      {showCart === "true" ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex flex-col items-center justify-center p-4"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={handleCloseCart}
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
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
              🛒 My Cart
            </h2>

            {cartItems == null ? (
              <p className="text-center text-gray-600">Your cart is empty.</p>
            ) : (
              <div className="space-y-4 overflow-auto max-h-96">
                {cartItems.map(
                  (items, index) =>
                    items.productId && (
                      <div
                        key={items._id || index}
                        className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={items.productId.image}
                            alt={items.productId.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">
                              {items.productId.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {items.productId.description}
                            </p>
                            <p className="text-gray-800 font-semibold mt-1">
                              ₹ {items.productId.price}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <button
                                onClick={() =>
                                  updateCartQuantity(
                                    items.productId,
                                    items.quantity - 1
                                  )
                                }
                                disabled={items.quantity <= 1}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                              >
                                -
                              </button>
                              <span className="text-gray-700">
                                {items.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateCartQuantity(
                                    items.productId,
                                    items.quantity + 1
                                  )
                                }
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <button
                            onClick={() =>
                              handleRemoveFromCart(items.productId)
                            }
                            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-sm px-4 py-1 rounded-md transition-colors"
                          >
                            {removeCartLoadingId === items.productId._id ? (
                              <div className="flex items-center justify-center">
                                <LoadingIcons.TailSpin
                                  stroke="#dc2626"
                                  strokeWidth={4}
                                  className="w-6 h-6 animate-spin"
                                />
                              </div>
                            ) : (
                              <>Remove </>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              handleBuyNowCart(items);
                            }}
                            disabled={loadingId === items.productId._id}
                            className="bg-zinc-900 text-white text-sm font-semibold py-1 px-4 rounded-md hover:bg-zinc-800 cursor-pointer transition-colors duration-300"
                          >
                            {loadingId === items.productId._id ? (
                              <div className="flex items-center justify-center">
                                <LoadingIcons.TailSpin
                                  stroke="#fff"
                                  strokeWidth={4}
                                  className="w-6 h-6 animate-spin"
                                />
                              </div>
                            ) : (
                              <>Buy !</>
                            )}

                            {/* Buy Now
                        {buttonLoading ? (
                          <LoadingIcons.BallTriangle
                            stroke="#fff"
                            strokeWidth={2}
                            className="w-6 h-6 animate-spin"
                          />
                        ) : (
                          "Buy Now"
                        )} */}
                          </button>
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
            {/* <div className="mt-6 flex justify-end">
              {cartItems.length > 0 && (
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                  Checkout
                </button>
              )}
            </div> */}
          </div>
        </div>
      ) : (
        <></>
      )}

      {selectedProduct && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <h2 className="text-2xl text-gray-600 font-semibold mb-4">
              {selectedProduct.name}
            </h2>
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
              {adminLogin === "admin" ? (
                <div className="flex space-x-2 mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(selectedProduct);
                    }}
                    className="w-full bg-zinc-100 text-zinc-900 border border-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-zinc-200 transition-colors duration-300"
                  >
                    Edit Item
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(selectedProduct);
                    }}
                    className="w-full bg-red-50 text-red-600 border border-red-200 font-semibold py-2 px-4 rounded-md hover:bg-red-100 transition-colors duration-300"
                  >
                    {deleteLoadingId === selectedProduct._id ? (
                      <div className="flex items-center justify-center">
                        <LoadingIcons.TailSpin
                          stroke="#dc2626"
                          strokeWidth={4}
                          className="w-6 h-6 animate-spin"
                        />
                      </div>
                    ) : (
                      "Delete Item"
                    )}
                  </button>
                </div>
              ) : (
                <></>
              )}
              <button
                onClick={() => addToCart(selectedProduct)}
                className="w-full sm:w-1/2 mb-2 sm:mb-0 bg-zinc-100 text-zinc-900 border border-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-zinc-200 transition-colors duration-300"
              >
                {addcartLoadingId === selectedProduct._id ? (
                  <div className="flex items-center justify-center">
                    <LoadingIcons.TailSpin
                      stroke="#18181b"
                      strokeWidth={4}
                      className="w-6 h-6 animate-spin"
                    />
                  </div>
                ) : (
                  "Add to Cart"
                )}
              </button>

              <button
                onClick={() => {
                  setProductToBuy(selectedProduct);

                  handleBuyNow(selectedProduct);
                }}
                className={`w-full sm:w-1/2 bg-zinc-900 text-white font-semibold py-2 px-4 rounded-md hover:bg-zinc-800 transition-colors duration-300`}
              >
                {loadingId === selectedProduct._id ? (
                  <div className="flex items-center justify-center">
                    <LoadingIcons.TailSpin
                      stroke="#fff"
                      strokeWidth={4}
                      className="w-6 h-6 animate-spin"
                    />
                  </div>
                ) : (
                  <>Buy Now</>
                )}
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

