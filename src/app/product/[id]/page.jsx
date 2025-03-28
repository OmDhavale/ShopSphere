// app/product/[id]/page.jsx
"use client";

import { useRouter } from 'next/navigation';

export default function ProductDetails({ params }) {
  const router = useRouter();
  const productId = params.id;

  // Replace with your actual product fetching logic
  const product = {
    id: productId,
    name: 'Product ' + productId,
    category: 'Example',
    price: 99.99,
    imageUrl: '/product1.jpg', // Replace with your image URL
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  const handlePlaceOrder = () => {
    // Implement your place order logic here
    console.log(`Order placed for product ${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-semibold text-gray-600 mb-4">{product.name}</h2>
        <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover mb-4 rounded-md" />
        <p className="text-gray-600 mb-2">Category: {product.category}</p>
        <p className="text-gray-600 font-semibold mb-4">${product.price.toFixed(2)}</p>

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