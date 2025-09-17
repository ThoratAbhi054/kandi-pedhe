"use client";

import wretch from "wretch";
import { useState, useEffect, useCallback } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSupabase } from "../../context/SupabaseContext";
import { API_URL, RAZORPAY_KEY_ID } from "../../utils/constant";
import { useRouter } from "next/navigation";
import Image from "next/image";

const api = wretch(API_URL).accept("application/json");

export default function Example() {
  const { session, signOut: supabaseSignOut } = useSupabase();
  const accessToken = session?.access_token;

  const [cart, setCart] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/iam/users/me/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch addresses");

      const data = await res.json();
      setAddresses(data.address || []);
      setProfile(data);

      if (!data.address || data.address.length === 0) {
        alert("No address found! Please add an address before checkout.");
        router.push("/profile");
        return;
      }

      const defaultAddress = data.address.find((addr) => addr.default);
      setSelectedAddress(
        defaultAddress ? defaultAddress.id : data.address[0].id
      );
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, [accessToken, router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK loaded");
    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  const getCart = useCallback(async () => {
    try {
      const url = new URL(`${API_URL}/cms/carts/`);

      url.searchParams.append("status", "DRAFT");

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          await supabaseSignOut();
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Cart API Response:", data);
      // Handle both array response and paginated response
      const cartData = Array.isArray(data) ? data : data.results || [];
      console.log("Processed Cart Data:", cartData);
      setCart(cartData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, supabaseSignOut]);

  const setDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(`${API_URL}/iam/addresses/${addressId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // FIXED: Added Authorization header
        },
        body: JSON.stringify({ default: true }),
      });

      if (!response.ok) throw new Error("Failed to update default address");

      fetchAddresses(); // Refresh addresses list after update
    } catch (error) {
      console.error("Error updating default address:", error);
      alert("Failed to update default address. Please try again.");
    }
  };

  useEffect(() => {
    getCart();
    fetchAddresses();
  }, [getCart, fetchAddresses]);

  const processPayment = async (cart) => {
    console.log("Processing Payment for Cart:", cart);

    try {
      // ✅ Check if Razorpay Key is configured
      if (!RAZORPAY_KEY_ID) {
        alert(
          "Razorpay configuration missing! Please check your environment variables."
        );
        console.error("RAZORPAY_KEY_ID is undefined");
        return;
      }

      // ✅ Ensure Razorpay SDK is Loaded
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded! Please try again.");
        return;
      }

      // ✅ Ensure Order ID Exists
      if (!cart || !cart.order_id) {
        alert("Order ID is missing! Please try again.");
        console.error("Cart or order_id is missing:", cart);
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID, // ✅ Use your Razorpay Key
        amount: cart.amount, // Amount in paise (INR)
        currency: "INR",
        name: "Ingale Pedha House",
        description: `Payment for ${cart.title}`,
        image: "/images/IngaleLogo.png", // ✅ Optional: Add a logo URL
        order_id: cart.order_id, // ✅ Use order ID from backend
        prefill: {
          name: profile.first_name || "Customer", // ✅ Customer name
          email: profile.email || "customer@example.com", // ✅ Customer email
          contact: profile.contact_no || "9999999999", // ✅ Customer contact
        },
        theme: {
          color: "#3399cc",
        },
        handler: async function (response) {
          console.log("Razorpay Payment Success:", response);

          // ✅ Ensure All Required Fields are Present
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
          ) {
            alert("Payment details missing. Please contact support.");
            return;
          }

          // ✅ Call Validate Payment API
          try {
            const validateResponse = await fetch(
              `${API_URL}/cms/carts/${cart.cart_id}/validate_payment/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                }),
              }
            );

            if (validateResponse.status === 204) {
              // ✅ Handle Success (204 No Content)
              console.log("Payment validation successful!");
              alert("Payment Successful! 🎉 Your order has been confirmed.");
              router.push("/my-purchases"); // ✅ Redirect to purchases page
            } else {
              // ✅ Handle Unexpected Responses
              const data = await validateResponse.json();
              console.error("Unexpected Response:", data);
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Error Validating Payment:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
      };

      // ✅ Handle Payment Failure
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        alert("Payment Failed: " + response.error.description);
      });

      // ✅ Open Razorpay Checkout
      paymentObject.open();
    } catch (error) {
      console.error("Error Processing Payment:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const checkout = async (cart_id) => {
    if (!cart_id || !selectedAddress) {
      alert("Please select an address before checking out.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/cms/carts/${cart_id}/checkout/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: selectedAddress }), // FIXED: Properly formatted JSON body
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to checkout cart: ${cart_id}`);
      }

      let data = await response.json();
      data.cart_id = cart_id;

      if (data.amount > 0) {
        console.log("Payment Amount:", data.amount);
        processPayment(data);
      } else {
        getCart();
      }

      // alert("Checkout successful!");
    } catch (error) {
      console.error("Failed to check-out cart!", error);
      alert("Failed to check-out cart. Please try again later.");
    }
  };

  // Debug logging
  console.log("Render - Cart state:", cart);
  console.log("Render - Cart length:", cart?.length);
  console.log("Render - Loading state:", loading);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">
              Loading your cart...
            </span>
          </div>
        ) : cart?.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto max-w-md">
              {/* Empty Cart Icon */}
              <div className="mx-auto h-24 w-24 text-gray-300 mb-6">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>

              {/* Empty Cart Message */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven&apos;t added any items to your cart yet.
                Start shopping to fill it up!
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                  Continue Shopping
                </button>

                <button
                  onClick={() => router.push("/categories")}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Browse Categories
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
            {/* Cart Items */}
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {cart?.map((cartItem) =>
                  cartItem.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col sm:flex-row py-6 sm:py-8"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-auto mb-4 sm:mb-0">
                        <Image
                          alt={item.data.title}
                          src={item.data.thumbnail}
                          width={128}
                          height={128}
                          className="w-full h-32 sm:h-24 sm:w-24 lg:h-32 lg:w-32 rounded-lg object-cover shadow-sm"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 sm:ml-4 lg:ml-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                              {item.data.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {item.data.description ||
                                "Delicious pedha from Ingale Pedha House"}
                            </p>
                          </div>

                          {/* Price and Stock Status */}
                          <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:items-end">
                            <p className="text-lg font-semibold text-gray-900">
                              ₹
                              {new Intl.NumberFormat("en-IN").format(
                                item.data.discounted_price ||
                                  item.data.price ||
                                  0
                              )}
                            </p>
                            {item.data.original_price &&
                              item.data.original_price >
                                (item.data.discounted_price ||
                                  item.data.price) && (
                                <p className="text-sm text-gray-500 line-through">
                                  ₹
                                  {new Intl.NumberFormat("en-IN").format(
                                    item.data.original_price
                                  )}
                                </p>
                              )}
                            <div className="mt-2 flex items-center space-x-2">
                              {item.inStock ? (
                                <CheckIcon className="h-4 w-4 text-green-500" />
                              ) : (
                                <ClockIcon className="h-4 w-4 text-gray-300" />
                              )}
                              <span
                                className={`text-sm ${
                                  item.inStock
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {item.inStock
                                  ? "In stock"
                                  : "Ships in a few weeks"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>

            {/* Address Selection */}
            <section className="mt-8 lg:col-span-5 lg:mt-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Address
                </h2>
                <div className="space-y-3">
                  {addresses.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedAddress === address.id
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                            className="sr-only"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {address.address1}
                                  {address.address2 && `, ${address.address2}`}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {address.city}, {address.state} -{" "}
                                  {address.pincode}
                                </p>
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <svg
                                      className="w-4 h-4 mr-2 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                      />
                                    </svg>
                                    {address.contact_no}
                                  </p>
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <svg
                                      className="w-4 h-4 mr-2 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      />
                                    </svg>
                                    {address.email}
                                  </p>
                                </div>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                {address.default ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Default
                                  </span>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setDefaultAddress(address.id);
                                    }}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded"
                                  >
                                    Set as Default
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        No addresses found
                      </p>
                      <button
                        onClick={() => router.push("/profile")}
                        className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Add an address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Order Summary */}
            <section className="mt-8 lg:col-span-12 lg:mt-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Order Details */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Items (
                      {cart?.reduce(
                        (total, cartItem) => total + cartItem.items.length,
                        0
                      ) || 0}
                      )
                    </span>
                    <span className="text-gray-900">
                      ₹
                      {new Intl.NumberFormat("en-IN").format(
                        cart && cart.length > 0
                          ? cart[0]?.discounted_amount || 0
                          : 0
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <dt className="text-lg font-semibold text-gray-900">
                        Total
                      </dt>
                      <dd className="text-xl font-bold text-gray-900">
                        ₹
                        {new Intl.NumberFormat("en-IN").format(
                          cart && cart.length > 0
                            ? cart[0]?.discounted_amount || 0
                            : 0
                        )}
                      </dd>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      checkout(cart && cart.length > 0 ? cart[0]?.id : null)
                    }
                    disabled={!cart || cart.length === 0 || !selectedAddress}
                    className={`w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 ${
                      !cart || cart.length === 0 || !selectedAddress
                        ? "opacity-50 cursor-not-allowed bg-gray-400 hover:scale-100"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                      />
                    </svg>
                    {!cart || cart.length === 0
                      ? "Cart is Empty"
                      : !selectedAddress
                      ? "Select Address First"
                      : "Proceed to Checkout"}
                  </button>

                  {/* Security Badge */}
                  <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Secure checkout with Razorpay
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
