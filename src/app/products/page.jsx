// app/products/page.jsx
"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton"

import { toast, ToastContainer } from "react-toastify";
import LoadingIcons from "react-loading-icons";

import EditProductForm from '../components/EditProductForm';
// import BuyComponent from '../product/[id]/BuyComponent'; // Import the BuyComponent
export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');  //for search filter
  const [filter, setFilter] = useState('all');  // for category filter  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);  // for user credentials menu - desktop page
  const userMenuRef = useRef(null);
  const router = useRouter(); // Initialize useRouter
  const [productToBuy, setProductToBuy] = useState({});
  const [user, setUser] = useState({});   //for storing user credentials from local storage
  const [selectedProduct, setSelectedProduct] = useState(null); //for showing description of selected product  const [categories,setCategories] = useState(null);
   //Fetching product data
  const [ loading, setLoading] = useState(true) //loading state of products skeleton
  const [buttonLoading, setButtonLoading] = useState(false) 
  const [products, setProducts] = useState([]); // for storing fetched products
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
          if(user.email === adminEmail && user.username === adminUsername){
              console.log("Admin logged in successfully");
              setAdminLogin("admin")
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Responsiveness for mobile screens */}
      <header className="py-8 px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 md:hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-semibold text-white">
            Hello {user.username} !
          </a>
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="h-6 w-6 fill-current text-white"
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
      </header>

      <header className="py-8 px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 hidden md:block">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-semibold text-white">
            Hello {user.username} !
          </a>

          <div className="flex items-center space-x-4">
            <div className="flex flex-row space-x-4">
              <button
                onClick={fetchCart}
                className="w-full bg-gradient-to-r  text-white font-semibold py-2 px-4 rounded-xl  cursor-pointer hover:shadow-lg  transform hover:scale-105 transition-all duration-500 ease-in-out"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.23)",
                }}
              >
                🛒My Cart
              </button>
              {adminLogin === "admin" ? (
                <>
                  <button
                    onClick={handleCreate}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-4 rounded-xl  hover:from-blue-700 hover:to-blue-500 cursor-pointer hover:shadow-lg  transform hover:scale-105 transition-all duration-500 ease-in-out"
                  >
                    + Product
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>

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
                [
                  ...new Map(
                    categories.map((cat) => [cat.toLowerCase(), cat])
                  ).values(),
                ].map((category, index) => (
                  <option
                    key={index}
                    value={category}
                    className="p-2 block hover:bg-purple-700/50"
                  >
                    {category}
                  </option>
                ))}
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
                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 transition-transform duration-300 ease-in-out ${
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
      {/* navbar for Mobile screens */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-64  shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        style={{ backdropFilter: "blur(44px)" }}
      >
        <div className="p-4 flex flex-col space-y-4">
          <div className="flex justify-end">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6 fill-current text-black"
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
          {/* <a href="/" className="text-2xl font-semibold text-gray-800">
            Hello {user.username} !
          </a> */}
          <div
            className="flex flex-row bg-white items-center space-x-4 rounded-xl py-2 px-3 focus:outline-none"
            // style={{
            //   backgroundColor: "rgba(0, 0, 0, 0.1)",
            // }}
          >
            <svg
              className="h-8 w-8 rounded-full bg-gray-500 fill-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 12c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6z" />
            </svg>
            <div className="flex flex-col">
              <span className="ml-2 text-gray-800">{user.username}</span>
              <span className="ml-2 text-gray-800">{user.email}</span>
            </div>
            <button onClick={handleLogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5 mr-2" // Optional: Adjust size and margin
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={async () => {
              await fetchCart();
              setIsMenuOpen(false);
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold py-2 px-4 rounded-xl cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out"
            // style={{
            //   backgroundColor: "rgba(0, 0, 0, 0.23)",
            // }}
          >
            🛒My Cart
          </button>
          {adminLogin === "admin" ? (
            <button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-4 rounded-xl hover:from-blue-700 hover:to-blue-500 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out"
            >
              + Product
            </button>
          ) : (
            <></>
          )}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl py-2 px-3 focus:outline-none text-gray-800"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
          />
          <div
            className="rounded-xl py-2 px-3 focus:outline-none flex flex-row font-sm text-gray-800 items-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          >
            Filter:
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 focus:outline-none text-gray-800 appearance-none"
              // style={{
              //   backgroundColor: "rgba(0, 0, 0, 0.1)",
              // }}
            >
              <option
                value="all"
                className="p-2 block hover:bg-purple-700/50 text-black"
              >
                All
              </option>
              {categories &&
                [
                  ...new Map(
                    categories.map((cat) => [cat.toLowerCase(), cat])
                  ).values(),
                ].map((category, index) => (
                  <option
                    key={index}
                    value={category}
                    className="p-2 block hover:bg-purple-700/50 text-black"
                  >
                    {category}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <main className="py-16 px-4 sm:px-6 lg:px-8 overflow-auto">
        <ToastContainer />
        {!loading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
              {filteredProducts.map((product, _id) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg  transform hover:scale-105 transition-all duration-500 ease-in-out"
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
                    <p className="text-gray-600">
                      Category: {product.category}
                    </p>
                    {/* for discount strike-through */}
                    <div className="flex flex-row gap-2 items-center mt-2">
                      <p className="text-red-600 line-through font-semibold">
                        ₹{(product.price * 1.2).toFixed(2)}
                      </p>
                      <p
                        className="bg-red-500 text-white font-bold py-1 px-2 rounded-full text-sm relative z-10"
                        // Adjust left padding for the icon
                      >
                        {Math.ceil(
                          ((product.price * 1.2 - product.price) /
                            (product.price * 1.2)) *
                            100
                        )}
                        % off !
                      </p>
                    </div>

                    {/* for actual price display */}
                    <p className="text-green-700 font-semibold text-xl">
                      ₹{product.price.toFixed(2)}
                    </p>
                    {/* for ratings */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Rating:
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={(e) => {
                              handleStarClick(star);
                              e.stopPropagation();
                            }}
                            className={`focus:outline-none`}
                          >
                            <svg
                              className="w-6 h-6"
                              viewBox="0 0 24 24"
                              fill={star <= rating ? starColor : "none"}
                              stroke={
                                star <= rating ? starColor : "currentColor"
                              }
                              strokeWidth={2}
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </button>
                        ))}
                        <span className="text-gray-600 ml-2">
                          {rating} stars
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    {adminLogin === "admin" ? (
                      <div className="flex space-x-2 mb-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product);
                          }}
                          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:from-green-600 hover:to-green-400 cursor-pointer hover:shadow-lg  transform hover:scale-105 transition-all duration-500 ease-in-out"
                        >
                          Edit Item
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product);
                          }}
                          className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-2 px-4 rounded-xl hover:from-red-700 hover:to-red-500 cursor-pointer hover:shadow-lg  transform hover:scale-105 transition-all duration-500 ease-in-out"
                        >
                          {deleteLoadingId === product._id ? (
                            <div className="flex items-center justify-center">
                              <LoadingIcons.TailSpin
                                stroke="#fff"
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
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-xl hover:from-pink-500 hover:to-purple-500 cursor-pointer hover:shadow-lg  transform hover:scale-105 transition-all duration-500 ease-in-out"
                      >
                        {addcartLoadingId === product._id ? (
                          <div className="flex items-center justify-center">
                            <LoadingIcons.TailSpin
                              stroke="#fff"
                              strokeWidth={4}
                              className="w-6 h-6 animate-spin"
                            />
                          </div>
                        ) : (
                          "Add to Cart"
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductToBuy(product);
                          setButtonLoading(true);
                          handleBuyNow(product);
                        }}
                        disabled={loadingId === product._id}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold py-2 px-4 rounded-xl hover:from-yellow-600 hover:to-yellow-400 cursor-pointer hover:shadow-lg  transform hover:scale-105 transition-all duration-500 ease-in-out"
                      >
                        {loadingId === product._id ? (
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
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center w-full h-50%">
              <p className="text-xl text-grey-400 font-semibold mb-4">
                Getting your products ready...wait a moment
              </p>
              <div className="flex flex-row w-full items-center justify-center space-x-4 pt-10">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
              <div className="flex flex-row w-full items-center justify-center space-x-4 pt-10">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
            </div>
          </>
        )}
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
                            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded"
                          >
                            {removeCartLoadingId === items.productId._id ? (
                              <div className="flex items-center justify-center">
                                <LoadingIcons.TailSpin
                                  stroke="#fff"
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
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-semibold py-1 px-4 rounded hover:from-yellow-600 hover:to-yellow-400 cursor-pointer hover:shadow-lg  transform hover:scale-105 transition-all duration-500 ease-in-out"
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
                    className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Edit Item
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(selectedProduct);
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    {deleteLoadingId === selectedProduct._id ? (
                      <div className="flex items-center justify-center">
                        <LoadingIcons.TailSpin
                          stroke="#fff"
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
                className="w-full sm:w-1/2 mb-2 sm:mb-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                {addcartLoadingId === selectedProduct._id ? (
                  <div className="flex items-center justify-center">
                    <LoadingIcons.TailSpin
                      stroke="#fff"
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
                className={`w-full sm:w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300`}
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

