"use client"; // ✅ Make sure this is a client component

import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import LoadingIcons from "react-loading-icons";

// import creditCardLogo from '../../../../public/images/payment/credit-card.png';
// import upiLogo from "../../../../public/images/payment/upi.png";
// import netBankingLogo from "../../../../public/images/payment/net-banking.jpg";


export default function ProductDetails({ params }) {
  const router = useRouter();
  const localCredentials = localStorage.getItem("localCredentials");
  //convert localCredentials to JSON object
  const parsedCredentials = JSON.parse(localCredentials);
  // ✅ Unwrap the Promise using use()
  const resolvedParams = use(params); // ✅ Fix: Unwrap params
  const productId = resolvedParams.id;
  const [cartQuantity, setCartQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState("");
  const [paymentOption, setPaymentOption] = useState("Credit Card (Static)"); // Static payment option
  const paymentOptions = ["Credit Card", "UPI", "Net Banking"]; // Available options
  const [phoneNumber, setPhoneNumber] = useState(""); 
const [rating, setRating] = useState(0);
const [deliverTomorrow, setDeliverTomorrow] = useState(false);
const [deliverByTwoDays, setDeliverByTwoDays] = useState(false);
 const starColor = "orange"; // You can change this to your desired color
const [isfound, setIsFound] = useState(true);
const [buyLoading, setBuyLoading] = useState(false);
 const handleStarClick = (selectedRating) => {
   setRating(selectedRating);
 };


const handleDeliverTomorrowChange = (event) => {
  setDeliverTomorrow(event.target.checked);
  // Uncheck the other option if this one is checked
  if (event.target.checked) {
    setDeliverByTwoDays(false);
  }
};

const handleDeliverByTwoDaysChange = (event) => {
  setDeliverByTwoDays(event.target.checked);
  // Uncheck the other option if this one is checked
  if (event.target.checked) {
    setDeliverTomorrow(false);
  }
};

//   const paymentMethods = [
//   { name: 'Credit Card', logo: creditCardLogo },
//   { name: 'UPI', logo: upiLogo },
//   { name: 'Net Banking', logo: netBankingLogo },
// ];
const paymentMethods = [
  { name: "Credit Card" },
  { name: "UPI" },
  { name: "Net Banking" },
  { name: "Google Pay" },
];
  // useEffect(() => {
  //   if (!productId) return;

  //   const fetchProduct = async () => {
  //     try {
  //       const response = await axios.post(
  //         "/api/getItems/buy",
  //         { product },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       console.log("Product fetched successfully:", response.data.item);
  //       //setProduct(response.data.item);
  //     } catch (error) {
  //       console.error("Error fetching product", error);
  //     }
  //   };

  //   fetchProduct();
  // }, [productId]);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        axios
          .post("/api/getMyCart", {
            email: parsedCredentials.email,
          })
          .then((response) => {
            //console log that item's quantity whose items.productId._id == productId here extracted from params

            if (
              response.data &&
              response.data.cart &&
              response.data.cart.items
            ) {
              // Find the item in the cart that matches the current product ID
              const cartItem = response.data.cart.items.find(
                (item) => item.productId?._id === productId
              );

              if (cartItem) {
                console.log(
                  `Quantity of product with ID ${productId} in cart:`,
                  cartItem.quantity
                );
                setProduct(cartItem.productId);
                setCartQuantity(cartItem.quantity);
              } else {
                console.log(`Product with ID ${productId} not found in cart.`);
                setCartQuantity(1); // Set quantity to 0 if not in cart
                setIsFound(false);
              }
              // toast.success("Cart loaded successfully!");
            } else {
              console.log("Cart data structure is not as expected.");
              setCartQuantity(1);
            }

            console.log("Cart items:", response.data.cart.items.quantity);
            // toast.success("Cart loaded successfully!");
          })
          .catch((err) => {
            console.log("Failed to load cart", err);
          });
      } catch (err) {
        console.log("Failed to load cart", err);
      }
    };
    fetchCart();
  }, [productId]);

  const buyProduct = async () => {
    const data = {
      cartQuantity,
      address,
      phoneNumber,
      paymentOption,
      totalAmount: cartQuantity * product?.price,
    };
    console.log("To buy: ",{product},{data});
    try {
      setBuyLoading(true);
      axios
        .post(
          "/api/getItems/buy",
          {
            product,data
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(
            "Product bought successfully:",
            response.data.item,
            response.data.data
           
          );
           setBuyLoading(false);
          toast.success("Placed Order for " + product.name + " successfully at " + response.data.data.address + " !");
        });
    } catch (err) {
      console.log("Error buying", err);
    }
  };
  if (!productId) {
    return <div>Loading...</div>; // ✅ Prevent accessing undefined productId
  }

   const handlePaymentSelect = (methodName) => {
    setPaymentOption(methodName);
    console.log(`Selected payment: ${methodName}`);
  };

  // const handlePlaceOrder = (name) => {
  //   console.log("Order Details:", {
  //     productId: product?._id,
  //     quantity: cartQuantity,
  //     address: address,
  //     phoneNumber: phoneNumber,
  //     paymentOption: paymentOption,
  //     totalAmount: cartQuantity * product?.price,
  //     userEmail: parsedCredentials?.email,
  //   });
  //   // Here you would typically send this order data to your backend API
  //   toast.success(`Order placed for ${name} at ${address?address:"nowhere"} !`);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        {product ? (
          <>
            <h2 className="text-3xl font-semibold text-gray-600 mb-4">
              {product.name}
            </h2>
            <div className="flex  flex-col md:flex-row justify-center items-center mb-4">
              <img
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="w-10% h-10% object-cover rounded-2xl shadow-neutral-900 p-2"
              />

              <div className="px-4 text-gray-600 mb-2 flex flex-col">
                <h3 className="text-l font-semibold mb-2 text-gray-600 ">
                  Category: {product.category}
                </h3>

                <div className=" text-gray-600 mb-2 text-sm  italic">
                  <span className="text-gray-600 mb-2">Description: </span>{" "}
                  {product.description}
                </div>
                {/* <h3 className="text-xl font-semibold mb-2">Customer Review</h3> */}

                {/* Rating Input */}
                {/* <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Rating:
                  </label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className={`focus:outline-none`}
                      >
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill={star <= rating ? starColor : "none"}
                          stroke={star <= rating ? starColor : "currentColor"}
                          strokeWidth={2}
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>
                    ))}
                    <span className="text-gray-600 ml-2">{rating} stars</span>
                  </div>
                </div> */}

                {/* Delivery Options Checkboxes */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Delivery Options:
                  </label>
                  <div className="flex items-center space-x-4">
                    <div>
                      <input
                        type="checkbox"
                        id="deliverTomorrow"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        checked={deliverTomorrow}
                        onChange={handleDeliverTomorrowChange}
                      />
                      <label
                        htmlFor="deliverTomorrow"
                        className="ml-2 text-gray-700 text-sm"
                      >
                        Deliver Tomorrow
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="deliverByTwoDays"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        checked={deliverByTwoDays}
                        onChange={handleDeliverByTwoDaysChange}
                      />
                      <label
                        htmlFor="deliverByTwoDays"
                        className="ml-2 text-gray-700 text-sm"
                      >
                        Deliver By 2 Days
                      </label>
                    </div>
                  </div>
                  {deliverTomorrow && deliverByTwoDays && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select only one delivery option.
                    </p>
                  )}
                </div>

                {/* You can add more review input fields here (e.g., text area for comments) */}
                {/* Example of displaying the selected options */}
                <div className="mt-4">
                  {/* <p className="text-gray-600 text-sm">
                    Selected Rating: {rating} stars
                  </p> */}
                  {deliverTomorrow && (
                    <p className="text-gray-600 text-sm">
                      Delivery Preference: Deliver Tomorrow
                    </p>
                  )}
                  {deliverByTwoDays && (
                    <p className="text-gray-600 text-sm">
                      Delivery Preference: Deliver By 2 Days
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* <p className="text-gray-600 font-semibold mb-4">₹{product.price}</p> */}

            <p className="text-red-600 line-through font-semibold">
              ₹{(product.price * 1.2).toFixed(2)}
            </p>
            {/* for actual price display */}
            <p className="text-green-700 font-semibold text-xl">
              ₹{product.price.toFixed(2)}
            </p>

            <p className="text-gray-600 font-semibold mb-4">
              Quantity: {cartQuantity}
            </p>
            <p className="text-gray-600 font-semibold mb-4">
              Total amount: ₹{cartQuantity * product.price}
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment Option:
              </label>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className={`cursor-pointer border rounded-md p-2 flex flex-col items-center justify-center ${
                      paymentOption === method.name
                        ? "border-green-500 shadow-md"
                        : "border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handlePaymentSelect(method.name)}
                  >
                    <p className="text-sm text-gray-600 mt-1">{method.name}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs italic mt-1">
                Select your preferred payment method.
              </p>
            </div>

            {/* Phone Number Input */}
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Phone Number:
              </label>
              <input
                type="tel" // Use type="tel" for phone number input
                id="phoneNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Shipping Address:
              </label>
              <textarea
                id="address"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your shipping address"
              />
            </div>

            <button
              onClick={() => {
                // handlePlaceOrder(product.name);
                buyProduct();
              }}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              {!buyLoading ? (
                "Place order"
              ) : (
                <div className="flex justify-center items-center">
                  <LoadingIcons.BallTriangle className="text-white h-5 w-5" />
                </div>
              )}
            </button>
          </>
        ) : (
          <p>
            {!isfound ? (
              <>Item not found in cart ! Please add it first in cart </>
            ) : (
              <>Loading your product...</>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
