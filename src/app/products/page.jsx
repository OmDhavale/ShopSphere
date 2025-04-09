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
  const [ loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [products, setProducts] = useState([]);
  const [adminLogin, setAdminLogin ] = useState("user")
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState("false");

  if (typeof window !== "undefined") {
    // Safely access localStorage here
    const localCredentials = localStorage.getItem("localCredentials");
  }
   
  //convert localCredentials to JSON object
  const parsedCredentials = JSON.parse(localCredentials);
      const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
// console.log("adminCredentials: ",adminEmail, adminUsername)
// console.log("localCredentials: ",parsedCredentials.email, parsedCredentials.username)
 
  // Static user data (replace with actual user data later)
  const user = {
    username: parsedCredentials.username,
    email: parsedCredentials.email,
  };

    useEffect(() => {

      const fetchProducts = async () => {

          if(parsedCredentials.email === adminEmail && parsedCredentials.username === adminUsername){
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
     email: parsedCredentials.email, // or userId if you store it
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
    axios.post("/api/getMyCart", {
      email: parsedCredentials.email,
    }).then((res)=>{
      
    console.log("Cart items:", res.data.cart.items);

    setCartItems(res.data.cart.items);
    setShowCart("true");
    console.log(showCart);
    console.log(cartItems.length);
    // toast.success("Cart loaded successfully!");
    }).catch((err)=>{
      toast.error("Failed to load cart",err);
    });

  } catch (err) {
    toast.error("Failed to load cart");
  }
};
const [removeCartLoadingId, setRemoveCartLoadingId] = useState(null);
  const handleRemoveFromCart = (productId) => {
    const prodId = productId._id;
    const email = parsedCredentials.email;
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
        email: parsedCredentials.email,
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
      <header className="py-8 px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-semibold text-white">
            Hello {parsedCredentials.username} !
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
                    <p className="text-red-600 line-through font-semibold">
                      ₹{(product.price * 1.2).toFixed(2)}
                    </p>
                    {/* for actual price display */}
                    <p className="text-green-700 font-semibold text-xl">
                      ₹{product.price.toFixed(2)}
                    </p>
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
              <div className="space-y-4">
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
                    Delete Item
                  </button>
                </div>
              ) : (
                <></>
              )}
              <button
                onClick={() => addToCart(selectedProduct)}
                className="w-full sm:w-1/2 mb-2 sm:mb-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  setProductToBuy(selectedProduct);

                  handleBuyNow(selectedProduct);
                }}
                className={`w-full sm:w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300`}
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

