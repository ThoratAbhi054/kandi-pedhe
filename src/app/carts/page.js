"use client";

import wretch from "wretch";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { AuthActions } from "../../app/auth/utils";
import { API_URL, RAZORPAY_KEY_ID } from "../../utils/constant";
import { useRouter } from "next/navigation";

const api = wretch(API_URL).accept("application/json");

export default function Example() {
  const { getToken } = AuthActions();
  const accessToken = getToken("access");

  const [cart, setCart] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchAddresses = async () => {
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
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK loaded");
    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  const getCart = async () => {
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
          await signOut();
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCart(data.results);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  const processPayment = async (cart) => {
    console.log("Processing Payment for Cart:", cart);

    try {
      // ✅ Ensure Razorpay SDK is Loaded
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded! Please try again.");
        return;
      }

      // ✅ Ensure Order ID Exists
      if (!cart.razorpay_order_id) {
        alert("Order ID is missing! Please try again.");
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID, // ✅ Use your Razorpay Key
        amount: cart.amount, // Amount in paise (INR)
        currency: "INR",
        name: "Ingale Pedha House",
        description: `Payment for ${cart.title}`,
        image: "/images/IngaleLogo.png", // ✅ Optional: Add a logo URL
        order_id: cart.razorpay_order_id, // ✅ Use order ID from backend
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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : cart.length === 0 ? (
          <p className="mt-6 text-lg text-gray-500">Your cart is empty.</p>
        ) : (
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* Cart Items */}
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {cart.map((cartItem) =>
                  cartItem.items.map((item) => (
                    <li key={item.id} className="flex py-6 sm:py-10">
                      <div className="shrink-0">
                        <img
                          alt={item.data.title}
                          src={item.data.thumbnail}
                          className="size-24 rounded-md object-cover sm:size-48"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <h3 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                          {item.data.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-900">
                          {item.data.discounted_price}
                        </p>
                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                          {item.inStock ? (
                            <CheckIcon className="size-5 shrink-0 text-green-500" />
                          ) : (
                            <ClockIcon className="size-5 shrink-0 text-gray-300" />
                          )}
                          <span>
                            {item.inStock ? "In stock" : "Ships in a few weeks"}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>

            {/* Address Selection */}
            <section className="mt-16 lg:col-span-5 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                Select Address
              </h2>
              <div className="mt-4 space-y-3">
                {addresses.length > 0 ? (
                  <section className="mt-4 space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer ${
                          selectedAddress === address.id
                            ? "border-indigo-600"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                          className="hidden"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {address.address1},
                          </p>
                          {address.address2 && (
                            <p className="text-sm text-gray-700">
                              {address.address2},
                            </p>
                          )}
                          <p className="text-sm text-gray-700">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-sm text-gray-600">
                            📞 {address.contact_no}
                          </p>
                          <p className="text-sm text-gray-600">
                            ✉️ {address.email}
                          </p>
                          {address.default ? (
                            <p className="text-sm font-semibold text-green-600">
                              ✅ Default Address
                            </p>
                          ) : (
                            <button
                              onClick={() => setDefaultAddress(address.id)}
                              className="mt-2 text-sm text-blue-600 underline"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </label>
                    ))}
                  </section>
                ) : (
                  <p className="text-sm text-gray-500">No addresses found.</p>
                )}
              </div>
            </section>

            {/* Order Summary */}
            <section className="mt-6 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8">
              <h2 className="text-lg font-medium text-gray-900">
                Order Summary
              </h2>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order Total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  ₹ {cart[0]?.discounted_amount || 0}
                </dd>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => checkout(cart[0]?.id)}
                  disabled={cart.length === 0 || !selectedAddress}
                  className={`w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none ${
                    cart.length === 0 || !selectedAddress
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Checkout
                </button>
              </div>
            </section>
          </form>
        )}
      </div>
    </div>
  );
}
