"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import "tailwindcss/tailwind.css";
import { API_URL } from "../utils/constant.js";
import Link from "next/link.js";
import { useRouter, usePathname } from "next/navigation";
import { AuthActions } from "../app/auth/utils.js";
import { useCart } from "../context/CartContext.jsx";

const navigation = {
  pages: [{ id: "1", name: "Stores", href: "#" }],
};

const LayoutComponent = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { getToken, logout, removeTokens } = AuthActions();
  const { cartCount } = useCart();
  const token = getToken("access");

  const getCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/categories/`, {
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
      setCategories(data?.results || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const pathName = usePathname();

  return (
    <html lang="en" className="h-full bg-white overflow-hidden">
      <head className="h-full"></head>
      <body>
        <div className="flex flex-col min-h-screen overflow-hidden">
          {pathName !== "/login" && pathName !== "/signup" && (
            <>
              {/* Mobile Menu */}
              <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="relative z-40 lg:hidden"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear" />
                <div className="fixed inset-0 z-40 flex">
                  <DialogPanel className="relative flex w-full max-w-xs flex-col bg-white pb-12 shadow-xl">
                    <div className="flex px-4 pb-2 pt-5">
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="relative -m-2 p-2 text-gray-400"
                      >
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>

                    {/* Scrollable Categories in Mobile Menu */}
                    <TabGroup className="mt-2">
                      <div className="border-b border-gray-200">
                        <TabList className="flex space-x-4 px-4 overflow-x-auto scrollbar-hide max-w-full">
                          {categories.map((category) => (
                            <Tab
                              key={category.id}
                              className="whitespace-nowrap px-3 py-2 text-base font-medium text-gray-900 hover:border-indigo-600"
                            >
                              <Link href={`/categories/${category.id}`}>
                                {category.title}
                              </Link>
                            </Tab>
                          ))}
                        </TabList>
                      </div>
                    </TabGroup>
                  </DialogPanel>
                </div>
              </Dialog>

              <header className="relative bg-white w-full overflow-hidden">
                <nav
                  aria-label="Top"
                  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                >
                  <div className="border-b border-gray-200">
                    <div className="flex h-16 items-center justify-between">
                      <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                      >
                        <Bars3Icon aria-hidden="true" className="size-6" />
                      </button>

                      {/* Logo */}
                      <div className="ml-4 flex lg:ml-0">
                        <Link href="/">
                          <img
                            alt="Logo"
                            src="/images/IngaleLogo.png"
                            className="h-16 w-auto"
                          />
                        </Link>
                      </div>

                      {/* Scrollable Categories Section */}
                      <div className="relative flex-grow mx-4">
                        <div
                          id="categoryScroll"
                          className="overflow-x-auto scrollbar-hide w-full max-w-full whitespace-nowrap"
                        >
                          <div className="flex space-x-4 px-4 py-2">
                            {categories.map((category) => (
                              <Link
                                key={category.id}
                                href={`/categories/${category.id}`}
                                className="inline-block px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                              >
                                {category.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Search & Cart */}
                      <div className="flex items-center space-x-4">
                        <a
                          href="#"
                          className="p-2 text-gray-400 hover:text-gray-500"
                        >
                          <MagnifyingGlassIcon
                            aria-hidden="true"
                            className="size-6"
                          />
                        </a>

                        {/* Cart */}
                        <div className="flow-root">
                          <Link
                            href="/carts"
                            className="group -m-2 flex items-center p-2"
                          >
                            <ShoppingCartIcon
                              aria-hidden="true"
                              className="size-6 text-gray-400 group-hover:text-gray-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                              {cartCount}
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </header>
            </>
          )}

          <main className="flex-grow">{children}</main>

          <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  &copy; {new Date().getFullYear()} Your Company. All rights
                  reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default LayoutComponent;
