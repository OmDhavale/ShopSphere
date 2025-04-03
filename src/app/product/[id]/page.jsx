// app/product/[id]/page.jsx
"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from "react";

// export default function ProductDetails({ params }) {
export default function ProductDetails({ params }) {
  const router = useRouter();
  console.log(params.id);
  const productId = params.id;
  const prodObj = {
    productId: productId,
  };
  console.log("Product ID:", prodObj);
  console.log(typeof prodObj);

  // if (!productId) {
  //   return <div>Product not found</div>;
  // }

  const [product, setProduct] = useState({});
  
    const fetchProduct = async () => {
      try {
        //get the item with productId from the api
        // const response = await axios.get(`/api/getItems/${productId}`);
        axios.post("/api/getItems/buy", prodObj, {
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          console.log("Product fetched successfully:", response.data.item);
          // Handle the response data as needed
          setProduct(response.data.item);
        }).catch((error) => {
          console.error("Error fetching product", error);
        });
      } catch (err) {
        console.log("Error fetching products", err);
      }
    };


  const handlePlaceOrder = () => {
    // Implement your place order logic here
    console.log(`Order placed for product ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold text-gray-600 mb-4">
          {/* {name} */}
        </h2>
        {/* <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover mb-4 rounded-md"
        /> */}
        <p className="text-gray-600 mb-2">Category: hello"</p>
        <p className="text-gray-600 font-semibold mb-4">
          44
          {/* ₹{price.toFixed(2)} */}
        </p>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}