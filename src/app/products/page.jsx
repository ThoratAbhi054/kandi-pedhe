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
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import { API_URL } from "../../utils/constant";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    price: "",
    is_discount: false,
    discounted_price: "",
  });

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
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
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
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Page Header */}
      <main className="pb-24">
        <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Workspace
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
            The secret to a tidy desk? Dont get rid of anything, just put it in
            really really nice looking containers.
          </p>
        </div>

        {/* Filters */}
        <Disclosure as="section" className="border-b border-t border-gray-200">
          <h2 className="sr-only">Filters</h2>
          <div className="relative py-4">
            <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
              <div>
                <DisclosureButton className="group flex items-center font-medium text-gray-700">
                  <FunnelIcon className="mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Filters
                </DisclosureButton>
              </div>
              <div className="pl-6">
                <button type="button" className="text-gray-500">
                  Clear all
                </button>
              </div>
            </div>
          </div>
          <DisclosurePanel className="border-t border-gray-200 py-10">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
              <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Price</legend>
                  <input
                    type="text"
                    className="mt-2 block w-full rounded-md border-gray-300 p-2"
                    placeholder="Enter price range"
                    value={filters.price}
                    onChange={(e) =>
                      setFilters({ ...filters, price: e.target.value })
                    }
                  />
                </fieldset>
                <fieldset>
                  <legend className="block font-medium">Category</legend>
                  <input
                    type="text"
                    className="mt-2 block w-full rounded-md border-gray-300 p-2"
                    placeholder="Enter category"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                  />
                </fieldset>
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        {/* Product Grid */}
        <section className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
          <h2 className="sr-only">Products</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative p-4 border rounded"
                >
                  <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200">
                    <img
                      alt={product.title}
                      src={product.thumbnail}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="pt-4 text-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-base font-medium text-gray-900">
                      ₹ {product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        <nav className="mx-auto mt-6 flex max-w-7xl justify-between px-4 text-sm font-medium text-gray-700 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-1">
            <button className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100">
              Previous
            </button>
          </div>
          <div className="hidden space-x-2 sm:flex">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                className={`inline-flex h-10 items-center rounded-md border px-4 ${
                  index === 0
                    ? "border-indigo-600 bg-white ring-1 ring-indigo-600"
                    : "border-gray-300 bg-white hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 justify-end">
            <button className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100">
              Next
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}
