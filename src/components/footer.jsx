"use client";

import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../utils/constant";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const footerNavigation = {
  shop: [
    { id: 1, name: "All Products", href: "/products" },
    { id: 2, name: "Categories", href: "/categories" },
    { id: 3, name: "New Arrivals", href: "/products?filter=new" },
    { id: 4, name: "Best Sellers", href: "/products?filter=popular" },
    { id: 5, name: "Sale Items", href: "/products?filter=sale" },
  ],
  company: [
    { id: 1, name: "About Us", href: "/about-us" },
    { id: 2, name: "Our Story", href: "/about-us" },
    { id: 3, name: "Quality Promise", href: "/about-us" },
    { id: 4, name: "Terms & Conditions", href: "/terms" },
    { id: 5, name: "Privacy Policy", href: "/privacy" },
  ],
  account: [
    { id: 1, name: "My Account", href: "/profile" },
    { id: 2, name: "My Orders", href: "/my-purchases" },
    { id: 3, name: "My Cart", href: "/carts" },
    { id: 4, name: "Wishlist", href: "/profile" },
  ],
  connect: [
    { id: 1, name: "Contact Us", href: "/contact" },
    { id: 2, name: "Store Locations", href: "/stores" },
    { id: 3, name: "Facebook", href: "#" },
    { id: 4, name: "Instagram", href: "#" },
  ],
};

const Footer = () => {
  const [hydrated, setHydrated] = useState(false);
  const [mainStores, setMainStores] = useState([]);

  const getMainStores = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/cms/branches/?is_main=true`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setMainStores(data?.results || []);
    } catch (err) {
      console.error("Error fetching main stores:", err);
    }
  }, []);

  useEffect(() => {
    setHydrated(true);
    getMainStores();
  }, [getMainStores]);

  if (!hydrated) return null; // Prevent mismatched HTML

  return (
    <>
      <footer aria-labelledby="footer-heading" className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-20 xl:grid xl:grid-cols-4 xl:gap-8">
            <div className="grid grid-cols-2 gap-8 xl:col-span-3">
              <div className="space-y-16 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Shop</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.shop.map((item) => (
                      <li key={item.id} className="text-sm">
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Company</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.company.map((item) => (
                      <li key={item.id} className="text-sm">
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Account</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.account.map((item) => (
                      <li key={item.id} className="text-sm">
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-16 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Connect</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.connect.map((item) => (
                      <li key={item.id} className="text-sm">
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Main Store
                  </h3>
                  <div className="mt-6 space-y-4">
                    {mainStores.length > 0 ? (
                      mainStores.map((store) => (
                        <div key={store.id} className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {store.title}
                          </h4>
                          {store.address && (
                            <div className="space-y-1">
                              <div className="flex items-start space-x-2">
                                <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-gray-500">
                                  <p>{store.address.address1}</p>
                                  {store.address.address2 && (
                                    <p>{store.address.address2}</p>
                                  )}
                                  <p>
                                    {store.address.city}, {store.address.state}{" "}
                                    {store.address.pincode}
                                  </p>
                                </div>
                              </div>
                              {store.contact_no && (
                                <div className="flex items-center space-x-2">
                                  <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <a
                                    href={`tel:${store.contact_no.replace(
                                      /\s/g,
                                      ""
                                    )}`}
                                    className="text-xs text-gray-500 hover:text-gray-600"
                                  >
                                    {store.contact_no}
                                  </a>
                                </div>
                              )}
                              {store.email && (
                                <div className="flex items-center space-x-2">
                                  <EnvelopeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <a
                                    href={`mailto:${store.email}`}
                                    className="text-xs text-gray-500 hover:text-gray-600"
                                  >
                                    {store.email}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500">
                        <p>Ingale Pedha House</p>
                        <p>NH-4 (Pune-Bangalore Highway)</p>
                        <p>Near Hotel Manasi Royal</p>
                        <p>Satara, Maharashtra 415003</p>
                        <p>+91 99221 49922</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 md:mt-16 xl:mt-0">
              <h3 className="text-sm font-medium text-gray-900">
                Sign up for our newsletter
              </h3>
              <p className="mt-6 text-sm text-gray-500">
                Get the latest updates on new products, special offers, and
                traditional sweet recipes.
              </p>
              <form className="mt-2 flex sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  className="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="ml-4 flex-shrink-0">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-200 py-10">
            <p className="text-sm text-gray-500">
              Copyright &copy; {new Date().getFullYear()} Ingale Pedha House
              (Hotel Ingale Inn & Pedha House). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
