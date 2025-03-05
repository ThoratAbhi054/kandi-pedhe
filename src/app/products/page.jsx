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
import { API_URL } from "../../utils/constant";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    category_name: "",
    short_code: "",
    price: "",
    is_discount: "",
    discounted_price: "",
    description: "",
  });

  const getProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/products/`, {
        redirect: "follow",
        headers: {
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
      setProducts(data); // Store the fetched data in state
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pb-8 pt-10"
                  >
                    <div className="space-y-4">
                      {category.featured.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="group aspect-h-1 aspect-w-1 relative overflow-hidden rounded-md bg-gray-100"
                        >
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="object-cover object-center group-hover:opacity-75"
                          />
                          <div className="flex flex-col justify-end">
                            <div className="bg-white bg-opacity-60 p-4 text-base sm:text-sm">
                              <a
                                href={item.href}
                                className="font-medium text-gray-900"
                              >
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0"
                                />
                                {item.name}
                              </a>
                              <p
                                aria-hidden="true"
                                className="mt-0.5 text-gray-700 sm:mt-1"
                              >
                                Shop now
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((column, columnIdx) => (
                      <div key={columnIdx} className="space-y-10">
                        {column.map((section) => (
                          <div key={section.name}>
                            <p
                              id={`${category.id}-${section.id}-heading-mobile`}
                              className="font-medium text-gray-900"
                            >
                              {section.name}
                            </p>
                            <ul
                              role="list"
                              aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section.items.map((item) => (
                                <li key={item.name} className="flow-root">
                                  <a
                                    href={item.href}
                                    className="-m-2 block p-2 text-gray-500"
                                  >
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <a
                    href={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </a>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindui.com/img/flags/flag-canada.svg"
                  className="block h-auto w-5 flex-shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  CAD
                </span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

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
        <Disclosure
          as="section"
          aria-labelledby="filter-heading"
          className="grid items-center border-b border-t border-gray-200"
        >
          <h2 id="filter-heading" className="sr-only">
            Filters
          </h2>
          <div className="relative col-start-1 row-start-1 py-4">
            <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
              <div>
                <DisclosureButton className="group flex items-center font-medium text-gray-700">
                  <FunnelIcon
                    aria-hidden="true"
                    className="mr-2 h-5 w-5 flex-none text-gray-400 group-hover:text-gray-500"
                  />
                  2 Filters
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
                  <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                    {filters.price.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          defaultValue={option.value}
                          defaultChecked={option.checked}
                          id={`price-${optionIdx}`}
                          name="price[]"
                          type="checkbox"
                          className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`price-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="block font-medium">Color</legend>
                  <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                    {filters.color.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          defaultValue={option.value}
                          defaultChecked={option.checked}
                          id={`color-${optionIdx}`}
                          name="color[]"
                          type="checkbox"
                          className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`color-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                <fieldset>
                  <legend className="block font-medium">Size</legend>
                  <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                    {filters.size.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          defaultValue={option.value}
                          defaultChecked={option.checked}
                          id={`size-${optionIdx}`}
                          name="size[]"
                          type="checkbox"
                          className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`size-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="block font-medium">Category</legend>
                  <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                    {filters.category.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center text-base sm:text-sm"
                      >
                        <input
                          defaultValue={option.value}
                          defaultChecked={option.checked}
                          id={`category-${optionIdx}`}
                          name="category[]"
                          type="checkbox"
                          className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`category-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </DisclosurePanel>
          <div className="col-start-1 row-start-1 py-4">
            <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
              <Menu as="div" className="relative inline-block">
                <div className="flex">
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <a
                          href={option.href}
                          className={classNames(
                            option.current
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "block px-4 py-2 text-sm data-[focus]:bg-gray-100"
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </Disclosure>

        {/* Product grid */}
        <section
          aria-labelledby="products-heading"
          className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8"
        >
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

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
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pagination */}
        <nav
          aria-label="Pagination"
          className="mx-auto mt-6 flex max-w-7xl justify-between px-4 text-sm font-medium text-gray-700 sm:px-6 lg:px-8"
        >
          <div className="min-w-0 flex-1">
            <a
              href="#"
              className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
            >
              Previous
            </a>
          </div>
          <div className="hidden space-x-2 sm:flex">
            {/* Current: "border-indigo-600 ring-1 ring-indigo-600", Default: "border-gray-300" */}
            <a
              href="#"
              className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
            >
              1
            </a>
            <a
              href="#"
              className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
            >
              2
            </a>
            <a
              href="#"
              className="inline-flex h-10 items-center rounded-md border border-indigo-600 bg-white px-4 ring-1 ring-indigo-600 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
            >
              3
            </a>
            <span className="inline-flex h-10 items-center px-1.5 text-gray-500">
              ...
            </span>
            <a
              href="#"
              className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
            >
              8
            </a>
            <a
              href="#"
              className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
            >
              9
            </a>
            <a
              href="#"
              className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
            >
              10
            </a>
          </div>
          <div className="flex min-w-0 flex-1 justify-end">
            <a
              href="#"
              className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-indigo-600"
            >
              Next
            </a>
          </div>
        </nav>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
