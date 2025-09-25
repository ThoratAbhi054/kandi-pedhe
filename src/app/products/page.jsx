"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    price: "",
    is_discount: false,
    discounted_price: "",
  });

  const { addToCart } = useCart();

  // Fetch Products (server-side pagination)
  const getProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("page_size", String(productsPerPage));

        // Map filters/search to query params expected by API
        if (searchQuery) {
          params.set("search", searchQuery);
        }
        if (filters.title) params.set("title", filters.title);
        if (filters.category) params.set("category", filters.category);
        if (filters.price) params.set("price_lte", String(filters.price));
        if (filters.is_discount) params.set("is_discount", "true");
        if (filters.discounted_price)
          params.set("discounted_price_lte", String(filters.discounted_price));

        const res = await fetch(
          `${API_URL}/cms/products/?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data?.results || []);
        setTotalCount(Number(data?.count || 0));
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, filters, productsPerPage]
  );

  // Refetch when filters/search/sort change
  useEffect(() => {
    getProducts(1);
  }, [getProducts]);

  // Calculate pagination display values from API count
  const totalProducts = totalCount;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + products.length;

  // Pagination handlers
  const goToPage = (page) => {
    getProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for delicious sweets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Sort and Filter Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Filters</span>
                  {(filters.price ||
                    filters.category ||
                    filters.is_discount) && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
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
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter max price"
                    value={filters.price}
                    onChange={(e) =>
                      setFilters({ ...filters, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {filters.price && (
                    <button
                      onClick={() => setFilters({ ...filters, price: "" })}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {filters.category && (
                    <button
                      onClick={() => setFilters({ ...filters, category: "" })}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-end">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.is_discount}
                    onChange={(e) =>
                      setFilters({ ...filters, is_discount: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    🔥 On Sale Only
                  </span>
                </label>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-500">
                  {totalProducts > 0 && (
                    <span className="font-medium text-gray-700">
                      {totalProducts} products found
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Dialog */}
        <Dialog
          open={open}
          onClose={setOpen}
          className="relative z-40 lg:hidden"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          <div className="fixed inset-0 z-40 flex">
            <Dialog.Panel className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Filter Products
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Max Price (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter max price"
                      value={filters.price}
                      onChange={(e) =>
                        setFilters({ ...filters, price: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {filters.price && (
                      <button
                        onClick={() => setFilters({ ...filters, price: "" })}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter category name"
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {filters.category && (
                      <button
                        onClick={() => setFilters({ ...filters, category: "" })}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.is_discount}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          is_discount: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      🔥 Show only products on sale
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-4">
                    {totalProducts > 0 && (
                      <span className="font-medium text-gray-700">
                        {totalProducts} products found
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setOpen(false)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
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
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
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
            ) : totalProducts > 0 ? (
              <>
                Showing {startIndex + 1} to {Math.min(endIndex, totalProducts)}{" "}
                of {totalProducts} products
                {searchQuery && ` for "${searchQuery}"`}
              </>
            ) : (
              "No products found"
            )}
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Product Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 bg-gray-200 rounded w-16" />
                      <div className="h-8 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
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
            <div className="text-center py-16">
              <div className="mx-auto h-32 w-32 text-gray-300 mb-6">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No products found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn&apos;t find any products matching your search
                criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  Clear All Filters
                </button>
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
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  View All Products
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
            {/* Mobile Pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`btn btn-outline btn-sm ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>
              <span className="flex items-center text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`btn btn-outline btn-sm ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </button>
            </div>

            {/* Desktop Pagination */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, totalProducts)}
                  </span>{" "}
                  of <span className="font-medium">{totalProducts}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`btn btn-outline btn-sm rounded-l-md ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((pageNumber, index) =>
                    pageNumber === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-sm text-gray-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`btn btn-sm ${
                          pageNumber === currentPage
                            ? "btn-primary"
                            : "btn-outline"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  )}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`btn btn-outline btn-sm rounded-r-md ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
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
