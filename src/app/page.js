"use client";

import { Fragment, useState, useEffect, useRef } from "react";

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
import { ProductCard, CategoryCard } from "../components/card";
import Link from "next/link";
import { AuthActions } from "../app/auth/utils.js";
import { useCart } from "../context/CartContext.jsx";
import Footer from "../components/footer.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // ✅ Correct Import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Image from "next/image";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Homepage() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [sliders, setSliders] = useState([]);
  const swiperRef = useRef(null);
  const videoRefs = useRef({});

  const { getToken, logout, removeTokens } = AuthActions();
  const { addToCart } = useCart();

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
      const res = await fetch(`${API_URL}/cms/products/?is_favourite=true`, {
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

  const handleSlideChange = (swiper) => {
    const currentSlide = sliders[swiper.activeIndex];
    if (currentSlide?.type === "VIDEO" && videoRefs.current[currentSlide.id]) {
      videoRefs.current[currentSlide.id].currentTime = 0; // Restart video
      videoRefs.current[currentSlide.id].play();
    }
  };

  const handleVideoEnd = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="relative w-full h-[600px] lg:h-[700px]">
          {sliders.length > 0 ? (
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              onSlideChange={handleSlideChange}
              className="w-full h-full"
            >
              {sliders.map((slide, index) => (
                <SwiperSlide key={slide.id} className="relative">
                  <div className="relative w-full h-full">
                    {slide.type === "VIDEO" && slide.video ? (
                      <div className="video-container w-full h-full">
                        <video
                          ref={(el) => (videoRefs.current[slide.id] = el)}
                          id={`video-player-${slide.id}`}
                          className="video-js w-full h-full object-cover"
                          autoPlay
                          muted
                          playsInline
                          preload="auto"
                          poster={slide.video.thumbnail}
                          onEnded={handleVideoEnd}
                        >
                          <source
                            src={slide.video.streaming_url}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={slide.image}
                          alt={`Slider ${slide.id}`}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                    )}

                    {/* Overlay content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white px-4 max-w-4xl">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                          Welcome to{" "}
                          <span className="gradient-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                            Ingale Pedha House
                          </span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-100 animate-slide-up">
                          Experience the authentic taste of traditional Indian
                          sweets, crafted with love and passed down through
                          generations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
                          <Link
                            href="/products"
                            className="btn btn-primary btn-lg bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            Explore Products
                          </Link>
                          <Link
                            href="/categories"
                            className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-full"
                          >
                            Browse Categories
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Welcome to{" "}
                  <span className="gradient-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Ingale Pedha House
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
                  Experience the authentic taste of traditional Indian sweets,
                  crafted with love and passed down through generations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/products"
                    className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Explore Products
                  </Link>
                  <Link
                    href="/categories"
                    className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold rounded-full"
                  >
                    Browse Categories
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-300/20 rounded-full blur-xl animate-pulse delay-500" />
      </section>

      <main>
        {/* Featured Products Section */}
        <section
          aria-labelledby="products-heading"
          className="py-16 bg-gray-50"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                id="products-heading"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                Our Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular and delicious sweets, carefully
                crafted using traditional recipes and the finest ingredients.
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {products.slice(0, 8).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} onAddToCart={addToCart} />
                </div>
              ))}
            </div>

            {/* View All Products Button */}
            <div className="text-center">
              <Link
                href="/products"
                className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section aria-labelledby="category-heading" className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                id="category-heading"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our delicious range of culinary delights, organized by
                traditional Indian sweet categories.
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {categories.slice(0, 8).map((category, index) => (
                <div
                  key={category.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>

            {/* View All Categories Button */}
            <div className="text-center">
              <Link
                href="/categories"
                className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-200"
              >
                View All Categories
              </Link>
            </div>
          </div>
        </section>

        {/* Customer Favorites Section */}
        <section
          aria-labelledby="favorites-heading"
          className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                id="favorites-heading"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                Customer Favorites
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These are the sweets our customers love the most! Try these
                popular choices and discover why they&apos;re so beloved.
              </p>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {favorites.slice(0, 8).map((favorite, index) => (
                <div
                  key={favorite.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={favorite} onAddToCart={addToCart} />
                </div>
              ))}
            </div>

            {/* Special Offer Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                🎉 Special Offer!
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Get 15% off on your first order when you try our customer
                favorites!
              </p>
              <Link
                href="/products"
                className="btn bg-white text-orange-600 hover:bg-gray-100 btn-lg px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Shop Now
              </Link>
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
