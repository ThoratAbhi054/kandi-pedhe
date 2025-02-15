"use client";

import wretch from "wretch";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { AuthActions } from "../../app/auth/utils";
import {
  API_URL,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} from "../../utils/constant";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const api = wretch(API_URL).accept("application/json");

const products = [
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    price: "$32.00",
    color: "Sienna",
    inStock: true,
    size: "Large",
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-01-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in sienna.",
  },
  {
    id: 2,
    name: "Basic Tee",
    href: "#",
    price: "$32.00",
    color: "Black",
    inStock: false,
    leadTime: "3–4 weeks",
    size: "Large",
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-01-product-02.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 3,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35.00",
    color: "White",
    inStock: true,
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-01-product-03.jpg",
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
];

export default function Example() {
  const { getToken } = AuthActions();
  const accessToken = getToken("access");

  const [cart, setCart] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);

  console.log("cart  ===========>", cart);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay SDK loaded"); // Confirm the SDK is loaded
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up the script when component unmounts
    };
  }, []);

  const getCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/carts/`, {
        redirect: "follow",
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
      setCart(data); // Store the fetched data in state
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const checkout = async (cart_id) => {
    try {
      const res = await fetch(`${API_URL}/iam/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to check profile");

      const profile = await res.json();

      // ✅ If profile is incomplete, redirect to complete-profile page
      if (
        !profile.firstName ||
        !profile.lastName ||
        !profile.phone ||
        !profile.address
      ) {
        alert("Please complete your profile before checkout.");
        router.push("/complete-profile");
        return;
      }

      const response = await fetch(
        `${API_URL}/cms/carts/${cart_id}/checkout/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to checkout cart: ${cart_id}`);
      }

      let data = await response.json();

      // Ensure cart_id is included in data
      data.cart_id = cart_id;

      if (data.amount > 0) {
        console.log("Payment Amount:", data.amount);
        processPayment(data);
      } else {
        getCart();
      }

      alert("Checkout successful!");
    } catch (error) {
      console.error("Failed to check-out cart!", error);
      alert("Failed to check-out cart. Please try again later.");
    }
  };

  const processPayment = async (paymentResponse) => {
    try {
      const orderId = paymentResponse.order_id;
      const cartId = paymentResponse.cart_id; // Ensure cart_id is passed

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: paymentResponse.amount * 100, // Ensure the amount is in paise
        currency: "INR",
        name: "Ingale Pedha House",
        description: "Purchase Items",
        order_id: orderId,
        handler: async function (response) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            cart_id: cartId,
          };

          const result = await fetch(
            `${API_URL}/cms/carts/${cartId}/validate_payment/`,
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (result.status === 204) {
            alert("Payment successful! Your order has been placed.");
          } else {
            const res = await result.json();
            alert(res.message);
          }
        },
        prefill: {
          name: "User Name", // Replace with dynamic user name
          email: "chavanmangesh245@gmail.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const total = cart.reduce((sum, cartItem) => {
      const itemTotal = cartItem.items.reduce(
        (subSum, item) =>
          subSum + item.data.discounted_price * item.data.quantity,
        0
      );
      return sum + itemTotal;
    }, 0);
    setOrderTotal(total);
  }, [cart]);

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {cart.map((cartItem) =>
                cartItem.items.map((item, cartIDx) => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="shrink-0">
                      <img
                        alt={item.data.title}
                        src={item.data.thumbnail}
                        className="size-24 rounded-md object-cover sm:size-48"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <a
                                href={item.href}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {item.data.title}
                              </a>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">{item.color}</p>
                            {item.data.quantity ? (
                              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                {item.data.quantity}
                              </p>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {item.data.discounted_price}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="grid w-full max-w-16 grid-cols-1">
                            <select
                              name={`quantity-${cartIDx}`}
                              aria-label={`Quantity, ${item.name}`}
                              className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                              <option value={6}>6</option>
                              <option value={7}>7</option>
                              <option value={8}>8</option>
                            </select>
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                          </div>

                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        {item.inStock ? (
                          <CheckIcon
                            aria-hidden="true"
                            className="size-5 shrink-0 text-green-500"
                          />
                        ) : (
                          <ClockIcon
                            aria-hidden="true"
                            className="size-5 shrink-0 text-gray-300"
                          />
                        )}

                        <span>
                          {item.inStock
                            ? "In stock"
                            : `Ships in ${item.leadTime}`}
                        </span>
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              {/* <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">$99.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                  <a
                    href="#"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$8.32</dd>
              </div> */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  ₹ {orderTotal.toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => checkout(cart[0].id)} // Accessing the ID of the first cart object
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
