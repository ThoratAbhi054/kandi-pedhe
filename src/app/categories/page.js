"use client";

import { Fragment, useState, useEffect } from "react";
import { API_URL } from "../../utils/constant";
import { useRouter } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    description: "",
    page: 1,
    page_size: 10,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getCategories = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_URL}/cms/categories/?${queryParams}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getCategories();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Categories</h1>
          <p className="mt-2 text-lg text-gray-600">
            Explore a variety of beautifully organized categories.
          </p>
        </div>

        {/* Search Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Search by title"
            className="w-full sm:w-64 border p-3 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="text"
            name="description"
            value={filters.description}
            onChange={handleFilterChange}
            placeholder="Search by description"
            className="w-full sm:w-64 border p-3 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.results?.map((category) => (
            <div
              key={category.id}
              className="group bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={category.thumbnail}
                  alt={category.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.title}
                </h3>
                <p className="mt-1 text-gray-500">{category.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-300"
          >
            Next
          </button>
        </nav>
      </main>
    </div>
  );
}
