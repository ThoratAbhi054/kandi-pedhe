"use client";

import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/20/solid";
import { API_URL } from "../../utils/constant";
import { ProductCard } from "../../components/card";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    price: "",
    is_discount: false,
    discounted_price: "",
  });

  const { addToCart } = useCart();

  // Fetch Products
  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cms/products/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setProducts(data?.results || []);
      setFilteredProducts(data?.results || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((product) =>
        product.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Price filter
    if (filters.price) {
      const price = parseFloat(filters.price);
      filtered = filtered.filter((product) => {
        const productPrice = product.discounted_price || product.price;
        return productPrice <= price;
      });
    }

    // Discount filter
    if (filters.is_discount) {
      filtered = filtered.filter(
        (product) =>
          product.discounted_price && product.discounted_price < product.price
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "price-low":
          return (
            (a.discounted_price || a.price) - (b.discounted_price || b.price)
          );
        case "price-high":
          return (
            (b.discounted_price || b.price) - (a.discounted_price || a.price)
          );
        case "newest":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, filters, sortBy]);

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of authentic Indian sweets,
              carefully crafted using traditional recipes and premium
              ingredients.
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-gray-700"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input w-40"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden btn btn-outline btn-sm flex items-center gap-2"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (₹)
                </label>
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.price}
                  onChange={(e) =>
                    setFilters({ ...filters, price: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Enter category"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.is_discount}
                    onChange={(e) =>
                      setFilters({ ...filters, is_discount: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    On Sale Only
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  setFilters({
                    title: "",
                    category: "",
                    price: "",
                    is_discount: false,
                    discounted_price: "",
                  })
                }
                className="btn btn-ghost btn-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters Dialog */}
        <Dialog
          open={open}
          onClose={setOpen}
          className="relative z-40 lg:hidden"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 z-40 flex">
            <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
              <div className="flex px-4 pb-2 pt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="ml-4 text-lg font-medium text-gray-900">
                  Filters
                </h2>
              </div>

              <div className="px-4 py-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.price}
                    onChange={(e) =>
                      setFilters({ ...filters, price: e.target.value })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Enter category"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.is_discount}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          is_discount: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      On Sale Only
                    </span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="btn btn-primary flex-1"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setFilters({
                        title: "",
                        category: "",
                        price: "",
                        is_discount: false,
                        discounted_price: "",
                      });
                      setOpen(false);
                    }}
                    className="btn btn-outline flex-1"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {loading ? (
              "Loading products..."
            ) : (
              <>
                Showing {filteredProducts.length} of {products.length} products
                {searchQuery && ` for "${searchQuery}"`}
              </>
            )}
          </p>
        </div>

        {/* Product Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="card p-6">
                  <div className="skeleton h-48 w-full mb-4" />
                  <div className="skeleton h-4 w-3/4 mb-2" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    title: "",
                    category: "",
                    price: "",
                    is_discount: false,
                    discounted_price: "",
                  });
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <nav className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button className="btn btn-outline btn-sm">Previous</button>
              <button className="btn btn-outline btn-sm">Next</button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">
                    {Math.min(12, filteredProducts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredProducts.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button className="btn btn-outline btn-sm rounded-l-md">
                    Previous
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${
                        page === 1 ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="btn btn-outline btn-sm rounded-r-md">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </nav>
        )}
      </main>
    </div>
  );
}
