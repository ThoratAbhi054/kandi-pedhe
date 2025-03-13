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
      setPurchases(data.results);
    } catch (err) {
      console.error("Error fetching purchases:", err);
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
          <p>Loading...</p>
        ) : purchases.length === 0 ? (
          <p className="mt-6 text-lg text-gray-500">
            No purchases found. Start shopping now!
          </p>
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
                {purchases.map((purchase) =>
                  purchase.items.map((item) => (
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
                          ₹ {item.data.discounted_price}
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
                  {purchases.reduce(
                    (sum, p) => sum + (p.discounted_amount || 0),
                    0
                  )}
                </dd>
              </div>
            </section>
          </section>
        )}
      </div>
    </div>
  );
}
