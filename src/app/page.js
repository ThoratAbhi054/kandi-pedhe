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
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { API_URL } from "../utils/constant.js";
import { CategorySlider } from "../components/categories";
import Link from "next/link";
import { AuthActions } from "../app/auth/utils.js";
import Footer from "../components/footer.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // ✅ Correct Import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Homepage() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [sliders, setSliders] = useState([]);

  const { getToken, logout, removeTokens } = AuthActions();

  const handleLogout = () => {
    logout()
      .res(() => {
        removeTokens();

        router.push("/");
      })
      .catch(() => {
        removeTokens();
        router.push("/");
      });
  };

  const fetchSliders = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/sliders/`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setSliders(data?.results || []);
    } catch (err) {
      console.error("Error fetching sliders:", err);
    }
  };

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
      setCategories(data?.results); // Store the fetched data in state
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getFavouriteProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/products/?is_favourite=TRUE`, {
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
      setFavorites(data?.results); // Store the fetched data in state
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

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
      setProducts(data?.results); // Store the fetched data in state
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getCategories();
    getFavouriteProducts();
    getProducts();
    fetchSliders();
  }, []);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog className="relative z-40 lg:hidden" open={open} onClose={setOpen}>
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
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                onClick={() => setOpen(false)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                {!token ? (
                  <a
                    href="#"
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Sign in
                  </a>
                ) : null}
              </div>

              <div className="flow-root">
                <a
                  href="#"
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  Create account
                </a>
              </div>
            </div>

            {/* <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  src="https://tailwindui.com/img/flags/flag-canada.svg"
                  alt=""
                  className="block h-auto w-5 flex-shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  CAD
                </span>
                <span className="sr-only">, change currency</span>
              </a>
            </div> */}
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative overflow-hidden">
        {/* Hero section */}
        <div className="relative w-full h-[550px]">
          {sliders.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop={true}
              className="w-full h-full"
            >
              {sliders.map((slide) => (
                <SwiperSlide key={slide.id} className="relative">
                  <div className="relative w-full h-[550px]">
                    {/* Image */}
                    <img
                      src={slide.image}
                      alt={`Slider ${slide.id}`}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50" />
                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                      <h1 className="text-4xl font-extrabold drop-shadow-lg">
                        इंगळे उद्योग समूह – ५९ वर्षांची अमूल्य सेवा
                      </h1>
                      <p className="mt-3 text-lg sm:max-w-2xl drop-shadow-md">
                        इंगळे कुटुंबियांच्या अथक प्रयत्नांनी आणि ग्राहकांच्या
                        विश्वासाने सुरू झालेल्या या प्रवासाने आज ५९ वर्षे पूर्ण
                        केली आहेत.
                      </p>
                      {/* Call to Action Button */}
                      <a
                        href="#"
                        className="mt-6 inline-block rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-700 transition"
                      >
                        अधिक जाणून घ्या
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="h-[550px] flex items-center justify-center bg-gray-200 rounded-lg">
              <p className="text-lg text-gray-500">No images available</p>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Product section */}

        <section aria-labelledby="products-heading">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <h2
              id="products-heading"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              Our Products
            </h2>

            {/* Horizontal Scrollable Section */}
            <div className="mt-10 overflow-x-auto whitespace-nowrap scroll-smooth">
              <div className="flex space-x-6">
                {products.map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group relative w-[250px] shrink-0 block"
                  >
                    {/* Product Image */}
                    <div className="h-[300px] overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-80 transition">
                      <img
                        alt={product.imageAlt}
                        src={product.thumbnail}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    {/* Product Title & Price */}
                    <div className="mt-4 text-center">
                      <h3 className="text-base font-semibold text-gray-900">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        ₹{" "}
                        {new Intl.NumberFormat("en-IN").format(
                          product.discounted_price
                        )}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Category section */}
        <section aria-labelledby="category-heading" className="bg-gray-50">
          <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Shop by Category
              </h2>
              <p className="mt-4 text-base text-gray-500">
                Explore Our Delicious Range of Culinary Delights
              </p>

              {/* Horizontal Scrollable Section */}
              <div className="mt-10 overflow-x-auto whitespace-nowrap scroll-smooth">
                <div className="flex space-x-6">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="group relative w-[250px] shrink-0"
                    >
                      <a
                        href={`/categories/${category.id}`}
                        className="absolute inset-0 z-10"
                        aria-hidden="true"
                      ></a>
                      <div className="h-[300px] overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-80 transition">
                        <img
                          alt={category.name}
                          src={category.thumbnail}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-base font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        {/* <p className="mt-2 text-sm text-gray-500">
                          {category.description}
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Favorites section */}
        <section aria-labelledby="favorites-heading">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <h2
              id="favorites-heading"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              Our Favorites
            </h2>

            {/* Horizontal Scrollable Section */}
            <div className="mt-10 overflow-x-auto whitespace-nowrap scroll-smooth">
              <div className="flex space-x-6">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="group relative w-[250px] shrink-0"
                  >
                    {/* ✅ Fully Clickable Card */}
                    <a
                      href={`/products/${favorite.id}`}
                      className="absolute inset-0 z-10"
                      aria-hidden="true"
                    ></a>

                    <div className="h-[300px] overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-80 transition">
                      <img
                        src={favorite.thumbnail}
                        alt={favorite.imageAlt}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="mt-4 text-center">
                      <h3 className="text-base font-semibold text-gray-900">
                        {favorite.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        ₹{" "}
                        {new Intl.NumberFormat("en-IN").format(
                          favorite.discounted_price
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        {/* <section aria-labelledby="sale-heading">
          <div className="overflow-hidden pt-32 sm:pt-14">
            <div className="bg-gray-800">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative pb-16 pt-48 sm:pb-24">
                  <div>
                    <h2
                      id="sale-heading"
                      className="text-4xl font-bold tracking-tight text-white md:text-5xl"
                    >
                      Final Stock.
                      <br />
                      Up to 50% off.
                    </h2>
                    <div className="mt-6 text-base">
                      <a href="#" className="font-semibold text-white">
                        Shop the sale
                        <span aria-hidden="true"> &rarr;</span>
                      </a>
                    </div>
                  </div>

                  <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                    <div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                      <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                        <div className="flex-shrink-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg"
                            alt=""
                          />
                        </div>

                        <div className="mt-6 flex-shrink-0 sm:mt-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                        <div className="flex-shrink-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-01.jpg"
                            alt=""
                          />
                        </div>

                        <div className="mt-6 flex-shrink-0 sm:mt-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-02.jpg"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                        <div className="flex-shrink-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg"
                            alt=""
                          />
                        </div>

                        <div className="mt-6 flex-shrink-0 sm:mt-0">
                          <img
                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                            src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default Homepage;
