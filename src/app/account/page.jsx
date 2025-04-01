// app/account/page.jsx
"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic here
      const reqBody = { email,password }
      axios
        .post("/api/login",reqBody,{
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Login successful:", response.data);
          toast.success("Login successful!");
        })
        .catch((error) => {
          console.error("Login error:", error);
          toast.error(error.data.message || "Login failed");
        });

      console.log("Login:", { email, password });
    } else {
      // Handle signup logic here
      
      const reqBody = { email,password }
      axios
        .post("/api/signup", reqBody,{
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Signup successful:", response.data);
          toast.success("Signup successful!");
        })
        .catch((error) => {
          console.error("Signup error:", error);
          toast.error(error.data.message || "Signup failed");
        });
      console.log("Signup:", { email, password });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      {" "}
      <ToastContainer /> {/* Added ToastContainer for toast notifications */}
      {/* Added p-4 for padding */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="name"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {isLogin ? "Login" : "Sign Up"}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="inline-block align-baseline font-bold text-sm text-pink-500 hover:text-pink-800"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
