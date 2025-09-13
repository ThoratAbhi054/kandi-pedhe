"use client";

import wretch from "wretch";
import { useState, useEffect } from "react";
import { CheckIcon, ClockIcon } from "@heroicons/react/20/solid";
import { AuthActions } from "../auth/utils";
import { API_URL } from "../../utils/constant";
import { useRouter } from "next/navigation";

const api = wretch(API_URL).accept("application/json");

export default function MyPurchases() {
  const { getToken } = AuthActions();
  const accessToken = getToken("access");

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPurchases = async () => {
    try {
      const url = new URL(`${API_URL}/cms/carts/`);
      url.searchParams.append("status", "CHECKOUT"); // ✅ Fetch only checkout carts

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("Purchases API Response:", data);

      // Handle both array response and paginated response
      const purchasesData = Array.isArray(data) ? data : data.results || [];
      setPurchases(purchasesData);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setPurchases([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          My Purchases
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">
              Loading your purchases...
            </span>
          </div>
        ) : !purchases || purchases.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="mx-auto max-w-md">
              {/* Empty Purchases Icon */}
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Empty Purchases Message */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No purchases yet
              </h2>
              <p className="text-gray-600 mb-8">
                You haven&apos;t made any purchases yet. Start shopping to see
                your order history here!
              </p>

              {/* Call to Action Button */}
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
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <section className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
            {/* Purchase Items */}
            <section
              aria-labelledby="purchases-heading"
              className="lg:col-span-9"
            >
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {purchases?.map((purchase) =>
                  purchase.items?.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col sm:flex-row py-6 sm:py-8"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-auto mb-4 sm:mb-0">
                        <img
                          alt={item.data?.title || "Product"}
                          src={item.data?.thumbnail || "/placeholder-image.jpg"}
                          className="w-full h-32 sm:h-24 sm:w-24 lg:h-32 lg:w-32 rounded-lg object-cover shadow-sm"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 sm:ml-4 lg:ml-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                              {item.data?.title || "Unknown Product"}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {item.data?.description ||
                                "Product from Ingale Pedha House"}
                            </p>
                          </div>

                          {/* Price and Status */}
                          <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:items-end">
                            <p className="text-lg font-semibold text-gray-900">
                              ₹
                              {new Intl.NumberFormat("en-IN").format(
                                item.data?.discounted_price ||
                                  item.data?.price ||
                                  0
                              )}
                            </p>
                            {item.data?.original_price &&
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
                                {item.inStock ? "Delivered" : "Processing"}
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

            {/* Order Summary */}
            <section className="mt-6 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:mt-0 lg:col-span-3 lg:p-8">
              <h2 className="text-lg font-medium text-gray-900">
                Purchase Summary
              </h2>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Total Amount Spent
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  ₹{" "}
                  {purchases?.reduce(
                    (sum, p) => sum + (p.discounted_amount || 0),
                    0
                  ) || 0}
                </dd>
              </div>
            </section>
          </section>
        )}
      </div>
    </div>
  );
}
