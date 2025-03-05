/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
"use client";

import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { API_URL } from "../../../utils/constant";
import Link from "next/link.js";
import Footer from "../../../components/footer";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductList({ params }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const categoryID = params.categoryID;
  const [filters, setFilters] = useState({
    title: "",
    priceMin: "",
    priceMax: "",
    isDiscount: "",
  });

  const getCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/categories/${categoryID}/`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(
        `${API_URL}/cms/products/?category=${categoryID}&${queryParams}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts(data?.results || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
    getProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          {categories.title}
        </h1>
        <p className="text-gray-600 text-center mt-2">
          {categories.description}
        </p>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <input
            type="text"
            name="title"
            placeholder="Search title"
            value={filters.title}
            onChange={handleFilterChange}
            className="p-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"
          />
          <input
            type="number"
            name="priceMin"
            placeholder="Min Price"
            value={filters.priceMin}
            onChange={handleFilterChange}
            className="p-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"
          />
          <input
            type="number"
            name="priceMax"
            placeholder="Max Price"
            value={filters.priceMax}
            onChange={handleFilterChange}
            className="p-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"
          />
          <select
            name="isDiscount"
            value={filters.isDiscount}
            onChange={handleFilterChange}
            className="p-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"
          >
            <option value="">Discount?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-center col-span-full text-gray-700">
              Loading...
            </p>
          ) : products.length === 0 ? (
            <p className="text-center col-span-full text-gray-700">
              No products found.
            </p>
          ) : (
            products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition">
                  <img
                    alt={product.title}
                    src={product.thumbnail}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          product.rating > i
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-gray-500">
                    {product.reviewCount} reviews
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
