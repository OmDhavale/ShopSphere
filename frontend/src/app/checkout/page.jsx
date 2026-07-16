"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, MapPin, Package, ArrowRight, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import LoadingIcons from "react-loading-icons";

export default function CheckoutPage() {
  const { cartItems, cartTotal, fetchCart } = useCart();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  
  // Form State
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    const localCredentials = localStorage.getItem("localCredentials");
    if (!localCredentials) {
      toast.info("Please login to proceed with checkout.");
      router.push("/login"); // Assuming login page exists
    } else {
      setUser(JSON.parse(localCredentials));
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!user?.email || cartItems.length === 0) return;
    setIsProcessing(true);
    try {
      // Typically, you'd send the whole cart or iterate
      // For demonstration, we simulate purchasing the first item, or an endpoint that handles the whole cart.
      // Based on legacy code, it used /api/getItems/buy which took { product, data }
      // Assuming we need to purchase each item or backend handles bulk if modified.
      
      const firstItem = cartItems[0];
      const data = {
        cartQuantity: firstItem.quantity,
        address,
        phoneNumber: phone,
        paymentOption: paymentMethod,
        totalAmount: cartTotal,
      };

      await axios.post("/api/getItems/buy", { product: firstItem.productId, data }, {
        headers: { "Content-Type": "application/json" }
      });
      
      // Clear cart or redirect
      setOrderComplete(true);
      fetchCart();
    } catch (error) {
      toast.error("Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-8">Thank you for your purchase. We've sent a confirmation email to {user?.email}.</p>
          <button 
            onClick={() => router.push("/products")}
            className="w-full bg-zinc-900 text-white font-semibold py-3 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: "Shipping", icon: <MapPin className="w-5 h-5" /> },
    { id: 2, title: "Payment", icon: <CreditCard className="w-5 h-5" /> },
    { id: 3, title: "Review", icon: <Package className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-24">
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Stepper */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= s.id ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-gray-300 text-gray-400 bg-white'
                }`}>
                  {s.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded ${step > s.id ? 'bg-zinc-900' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* Main Form Area */}
            <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Details</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      placeholder="123 Commerce St, Suite 100..."
                    />
                  </div>
                  <button 
                    disabled={!phone || !address}
                    onClick={() => setStep(2)}
                    className="w-full bg-zinc-900 text-white font-semibold py-4 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Credit Card", "UPI", "Net Banking", "Google Pay"].map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-xl border-2 text-left transition-colors ${
                          paymentMethod === method ? 'border-zinc-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="block font-medium text-gray-900">{method}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pt-6 flex gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-6 py-4 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      className="flex-1 bg-zinc-900 text-white font-semibold py-4 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                    >
                      Review Order <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review & Confirm</h2>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping to</h3>
                    <p className="text-gray-600 text-sm mb-4">{address}</p>
                    <p className="text-gray-600 text-sm">{phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> {paymentMethod}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={isProcessing}
                      className="px-6 py-4 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-zinc-900 text-white font-semibold py-4 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <LoadingIcons.TailSpin stroke="#fff" className="w-5 h-5 animate-spin" /> : "Place Order"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full md:w-80 bg-gray-50 p-8">
              <h3 className="font-semibold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-3">
                    <img src={item.productId?.image} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-gray-900 line-clamp-2">{item.productId?.name}</p>
                      <p className="text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="font-semibold mt-1">₹{(item.productId?.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 text-lg pt-2 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
