//input form for creating new Item and sending it to the backend and storing to db
"use client";
import React from 'react'
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import LoadingIcons from 'react-loading-icons'
const page = () => {
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [category,setCategory] = useState("");
    const [image,setImage] = useState("");
    const [loading,setLoading] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        const reqBody = { name,description,price,category,image }
        axios.post("/api/createItem",reqBody,{
            headers:{
                "Content-Type":"application/json",
            }
        }).then((response)=>{
            console.log("Item created :",response.data);
            toast.success("Item created successfully!");
            setName("");
            setDescription("");
            setPrice("");
            setCategory("");
            setImage("");
            router.push("/products")

        }).catch((error)=>{
            console.log("ERROR CREATING ITEM",error);
            toast.error(error.data.message || "Item creation failed");
        })
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      {" "}
      <ToastContainer /> {/* Added ToastContainer for toast notifications */}
      {/* Added p-4 for padding */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create Item
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="name"
              id="name"
              value={name}
                onChange={(e) => setName(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description
            </label>
            <input
              type="name"
              id="description"
              value={description}
                onChange={(e) => setDescription(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Price
            </label>
            <input
              type="name"
              id="price"
              value={price}
                onChange={(e) => setPrice(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Category
            </label>
            <input
              type="name"
              id="category"
              value={category}
                onChange={(e) => setCategory(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Image
            </label>
            <input
              type="name"
              id="image"
              value={image}
                onChange={(e) => setImage(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            {" "}
            {/* Modified flex for mobile view */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" //w-full added.
            >
              {loading ? (
                <LoadingIcons.BallTriangle
                  stroke="#fff"
                  strokeWidth={2}
                  className="w-6 h-6 animate-spin"
                />
              ) : (
                "Create Item"
              )}
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default page