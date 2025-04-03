"use client"; // ✅ Make sure this is a client component

import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import axios from 'axios';

export default function ProductDetails({ params }) {
  const router = useRouter();
  
  // ✅ Unwrap the Promise using use()
  const resolvedParams = use(params); // ✅ Fix: Unwrap params
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.post("/api/getItems/buy", { productId }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Product fetched successfully:", response.data.item);
        setProduct(response.data.item);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!productId) {
    return <div>Loading...</div>; // ✅ Prevent accessing undefined productId
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        {product ? (
          <>
            <h2 className="text-3xl font-semibold text-gray-600 mb-4">
              {product.name}
            </h2>
            <div className="flex justify-center items-center mb-4">
              <img
                src={product.image}
                alt={product.name}
                width={500}
                height={300}
                className="w-20% h-20% object-cover rounded-2xl shadow-neutral-800" 
              />
            </div>

            <p className="text-gray-600 mb-2">Category: {product.category}</p>
            <p className="text-gray-600 font-semibold mb-4">₹{product.price}</p>
            <button
              onClick={() => console.log(`Order placed for ${product.name}`)}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Place Order
            </button>
          </>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
    </div>
  );
}
