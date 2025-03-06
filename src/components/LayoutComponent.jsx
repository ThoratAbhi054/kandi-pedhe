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
import "tailwindcss/tailwind.css";
import { API_URL } from "../utils/constant.js";
import Link from "next/link.js";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AuthActions } from "../app/auth/utils.js";
import { useCart } from "../context/CartContext.jsx";

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

                    {/* Links */}
                    <TabGroup className="mt-2">
                      <div className="border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <TabList className="flex space-x-4 px-4">
                          {categories?.results?.map((category) => (
                            <Tab
                              key={category.title}
                              className="flex-shrink-0 px-3 py-4 text-base font-medium text-gray-900 border-b-2 border-transparent whitespace-nowrap data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
                            >
                              <Link href={`/categories/${category.id}`}>
                                {category.title}
                              </Link>
                            </Tab>
                          ))}
                        </TabList>
                      </div>
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

                    <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                      <div className="flow-root">
                        {!token && (
                          <a
                            href="/login"
                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            Sign in
                          </a>
                        )}
                      </div>
                      <div className="flow-root">
                        {!token && (
                          <a
                            href="/signup"
                            className="-m-2 block p-2 font-medium text-gray-900"
                          >
                            Sign up
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6">
                      <a href="#" className="-m-2 flex items-center p-2">
                        <img
                          alt=""
                          src="https://tailwindui.com/plus/img/flags/flag-canada.svg"
                          className="block h-auto w-5 shrink-0"
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
              <header className="relative bg-white">
                {/* <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
              Get free delivery on orders over $100
            </p> */}

                <nav
                  aria-label="Top"
                  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                >
                  <div className="border-b border-gray-200">
                    <div className="flex h-16 items-center">
                      <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                      </button>

                      {/* Logo */}
                      <div className="ml-4 flex lg:ml-0">
                        <a href="/">
                          <span className="sr-only">Your Company</span>
                          <img
                            alt=""
                            src="/images/IngaleLogo.png"
                            className="h-16 w-auto"
                          />
                        </a>
                      </div>

                      {/* Flyout menus */}
                      <div className="flex h-full space-x-8">
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
                      </div>

                      <div className="ml-auto flex items-center">
                        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                          {!token && (
                            <a
                              href="/login"
                              className="text-sm font-medium text-gray-700 hover:text-gray-800"
                            >
                              Sign in
                            </a>
                          )}

                          <span
                            aria-hidden="true"
                            className="h-6 w-px bg-gray-200"
                          />
                          {!token && (
                            <a
                              href="/signup"
                              className="-m-2 block p-2 font-medium text-gray-900"
                            >
                              Sign up
                            </a>
                          )}
                        </div>

                        {/* <div className="hidden lg:ml-8 lg:flex">
                      <a
                        href="#"
                        className="flex items-center text-gray-700 hover:text-gray-800"
                      >
                        <img
                          alt=""
                          src="https://tailwindui.com/plus/img/flags/flag-canada.svg"
                          className="block h-auto w-5 shrink-0"
                        />
                        <span className="ml-3 block text-sm font-medium">
                          CAD
                        </span>
                        <span className="sr-only">, change currency</span>
                      </a>
                    </div> */}

                        {/* Search */}
                        <div className="flex lg:ml-6">
                          <a
                            href="#"
                            className="p-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Search</span>
                            <MagnifyingGlassIcon
                              aria-hidden="true"
                              className="size-6"
                            />
                          </a>
                        </div>

                        {/* Cart */}
                        <div className="ml-4 flow-root lg:ml-6">
                          <a
                            href="/carts"
                            className="group -m-2 flex items-center p-2"
                          >
                            <ShoppingCartIcon
                              aria-hidden="true"
                              className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                              {cartCount}
                            </span>
                            <span className="sr-only">
                              items in cart, view bag
                            </span>
                          </a>
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
                <div className="text-sm">
                  Developed By:{" "}
                  <a
                    href="https://www.linkedin.com/in/abhishekathorat/"
                    className="text-indigo-400 hover:underline"
                    target="_blank"
                  >
                    Abhishek Thorat
                  </a>
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
