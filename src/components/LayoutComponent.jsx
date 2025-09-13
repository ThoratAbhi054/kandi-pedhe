"use client";
import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { API_URL } from "../utils/constant.js";
import Link from "next/link.js";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AuthActions } from "../app/auth/utils.js";
import { useCart } from "../context/CartContext.jsx";
import { FaUserCircle } from "react-icons/fa"; // ✅ Import Profile Icon

const navigation = {
  pages: [{ id: "1", name: "Stores", href: "#" }],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LayoutComponent = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { getToken, logout, removeTokens } = AuthActions();
  const { cartCount } = useCart(); // ✅ Safely use Context API

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
      setCategories(data); // Store the fetched data in state
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);
  const pathName = usePathname();

  return (
    <html lang="en" className="h-full bg-white">
      <head className="h-full"></head>
      <body>
        <div className="flex flex-col min-h-screen">
          {pathName === "/login" || pathName === "/signup" ? (
            <></>
          ) : (
            <>
              {" "}
              {/* Mobile menu */}
              <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="relative z-40 lg:hidden"
              >
                <DialogBackdrop
                  transition
                  className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                />

                <div className="fixed inset-0 z-40 flex">
                  <DialogPanel
                    transition
                    className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                  >
                    <div className="flex px-4 pb-2 pt-5">
                      <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="px-4 py-6">
                      <div className="space-y-1">
                        <Link
                          href="/products"
                          className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Products
                        </Link>
                        <Link
                          href="/categories"
                          className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Categories
                        </Link>
                        <Link
                          href="/stores"
                          className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Stores
                        </Link>
                        {categories?.results?.slice(0, 5).map((category) => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.id}`}
                            className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {category.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* User Actions */}
                    <div className="border-t border-gray-200 px-4 py-6">
                      {!token ? (
                        <div className="space-y-3">
                          <Link
                            href="/login"
                            className="btn btn-ghost w-full justify-center"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sign in
                          </Link>
                          <Link
                            href="/signup"
                            className="btn btn-primary w-full justify-center"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sign up
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Link
                            href="/profile"
                            className="btn btn-ghost w-full justify-center"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <FaUserCircle className="size-5" />
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              removeTokens();
                              router.push("/");
                              setMobileMenuOpen(false);
                            }}
                            className="btn btn-ghost w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Sign out
                          </button>
                        </div>
                      )}
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>
              <header className="relative bg-white shadow-sm border-b border-gray-200">
                {/* Promotional banner */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm font-medium sm:px-6 lg:px-8">
                    🎉 Free delivery on orders over ₹500! Order now and enjoy
                    our delicious treats.
                  </div>
                </div>

                <nav
                  aria-label="Top"
                  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                >
                  <div className="border-b border-gray-200">
                    <div className="flex h-20 items-center justify-between">
                      {/* Mobile menu button */}
                      <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="relative rounded-lg bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200 lg:hidden"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                      </button>

                      {/* Logo */}
                      <div className="flex lg:ml-0">
                        <Link href="/" className="group">
                          <span className="sr-only">Ingale Pedha House</span>
                          <div className="flex items-center space-x-3">
                            <img
                              alt="Ingale Pedha House Logo"
                              src="/images/IngaleLogo.png"
                              className="h-12 w-auto transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="hidden sm:block">
                              <h1 className="text-xl font-bold text-gray-900">
                                Ingale Pedha House
                              </h1>
                              <p className="text-sm text-gray-600">
                                Authentic Indian Sweets
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* Flyout menus */}
                      {/* <div className="flex h-full space-x-8">
                        {categories?.results?.map((category) => (
                          <Popover key={category.name} className="flex">
                            <div className="relative flex">
                              <div className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-[open]:border-indigo-600 data-[open]:text-indigo-600">
                                <Link href={`/categories/${category.id}`}>
                                  {category.title}
                                </Link>
                              </div>
                            </div>
                          </Popover>
                        ))}

                        {navigation.pages.map((page) => (
                          <a
                            key={page.name}
                            href={page.href}
                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            {page.name}
                          </a>
                        ))}
                      </div> */}

                      {/* Desktop Navigation */}
                      <div className="hidden lg:flex lg:items-center lg:space-x-8">
                        <Link
                          href="/products"
                          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                        >
                          Products
                        </Link>
                        <Link
                          href="/categories"
                          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                        >
                          Categories
                        </Link>
                        <Link
                          href="/stores"
                          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                        >
                          Stores
                        </Link>
                      </div>

                      {/* Right side actions */}
                      <div className="ml-auto flex items-center space-x-4">
                        {/* Search */}
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                          <span className="sr-only">Search</span>
                          <MagnifyingGlassIcon className="size-6" />
                        </button>

                        {/* User Actions */}
                        <div className="flex items-center space-x-2">
                          {!token ? (
                            <>
                              <Link
                                href="/login"
                                className="btn btn-ghost btn-sm"
                              >
                                Sign in
                              </Link>
                              <Link
                                href="/signup"
                                className="btn btn-primary btn-sm"
                              >
                                Sign up
                              </Link>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => router.push("/profile")}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                title="Profile"
                              >
                                <FaUserCircle className="size-6" />
                                <span className="sr-only">Profile</span>
                              </button>
                              <button
                                onClick={() => {
                                  logout();
                                  removeTokens();
                                  router.push("/");
                                }}
                                className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Sign out
                              </button>
                            </>
                          )}
                        </div>

                        {/* Cart */}
                        <Link
                          href="/carts"
                          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                        >
                          <ShoppingCartIcon className="size-6" />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-medium flex items-center justify-center animate-scale-in">
                              {cartCount}
                            </span>
                          )}
                          <span className="sr-only">
                            {cartCount} items in cart, view bag
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </nav>
              </header>
            </>
          )}

          <main className="flex-grow">{children}</main>

          <footer className="bg-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src="/images/IngaleLogo.png"
                      alt="Ingale Pedha House"
                      className="h-10 w-auto"
                    />
                    <div>
                      <h3 className="text-lg font-bold">Ingale Pedha House</h3>
                      <p className="text-sm text-gray-400">
                        Authentic Indian Sweets
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 max-w-md">
                    Experience the rich tradition of Indian sweets with our
                    authentic recipes passed down through generations. Fresh,
                    delicious, and made with love.
                  </p>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <span className="sr-only">Facebook</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <span className="sr-only">Instagram</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    Quick Links
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/products"
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/categories"
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/stores"
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        Stores
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/my-purchases"
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        My Orders
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    Contact
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>📞 +91 98765 43210</li>
                    <li>✉️ info@ingalepedha.com</li>
                    <li>📍 Mumbai, Maharashtra</li>
                    <li>🕒 Mon-Sun: 9AM-9PM</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-800 mt-8 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Ingale Pedha House. All
                    rights reserved.
                  </p>
                  <div className="flex space-x-6 mt-4 md:mt-0">
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Terms of Service
                    </Link>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Developed with ❤️ by{" "}
                    <a
                      href="https://www.linkedin.com/in/abhishekathorat/"
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abhishek Thorat
                    </a>{" "}
                    &{" "}
                    <a
                      href="https://www.linkedin.com/in/chavanmangesh245/"
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mangesh Chavan
                    </a>
                  </p>
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
