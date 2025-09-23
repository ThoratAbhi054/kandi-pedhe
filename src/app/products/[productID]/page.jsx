"use client";

import { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Radio,
  RadioGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import {
  API_URL,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} from "../../../utils/constant";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { useSupabase } from "../../../context/SupabaseContext";
import { useCart } from "../../../context/CartContext"; // ✅ Import Cart Context
import Image from "next/image";

const license = {
  href: "#",
  summary:
    "For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.",
  content: `
      <h4>Overview</h4>
      
      <p>For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.</p>
      
      <ul role="list">
      <li>You\'re allowed to use the icons in unlimited projects.</li>
      <li>Attribution is not required to use the icons.</li>
      </ul>
      
      <h4>What you can do with it</h4>
      
      <ul role="list">
      <li>Use them freely in your personal and professional work.</li>
      <li>Make them your own. Change the colors to suit your project or brand.</li>
      </ul>
      
      <h4>What you can\'t do with it</h4>
      
      <ul role="list">
      <li>Don\'t be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
      <li>Don\'t be evil. These icons cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
      </ul>
    `,
};

// Keep raw URLs to match home/list behavior
const normalizeImageUrl = (url) => url || null;

function formatDateToHumanReadable(dateString) {
  return new Date(dateString).toLocaleString("en-IN", {
    weekday: "long", // Weekday, e.g. Monday
    year: "numeric", // Year, e.g. 2024
    month: "long", // Month, e.g. November
    day: "numeric", // Day of the month, e.g. 27
    hour: "numeric", // Hour, e.g. 23
    minute: "numeric", // Minute, e.g. 59
    hour12: true, // Use 12-hour clock
  });
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example(params) {
  const { session, signOut } = useSupabase();
  const router = useRouter();
  const id = params?.params?.productID;
  const searchParams = useSearchParams();
  const [products, setProducts] = useState({});
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const accessToken = session?.access_token;
  const { addToCart, isProductAddingToCart } = useCart(); // ✅ Use `addToCart` and loading state
  console.log("license  ===>", products);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [faqsLoading, setFaqsLoading] = useState(true); // ✅ FAQs Loading state
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [itemQuantities, setItemQuantities] = useState({});

  // Get the lowest price from items array
  const getLowestPrice = () => {
    if (!products.items || products.items.length === 0) {
      return products.discounted_price || products.price || 0;
    }

    const lowestPriceItem = products.items.reduce((min, item) => {
      const price = parseFloat(item.discounted_price || item.price || 0);
      const minPrice = parseFloat(min.discounted_price || min.price || 0);
      return price < minPrice ? item : min;
    });

    return parseFloat(
      lowestPriceItem.discounted_price || lowestPriceItem.price || 0
    );
  };

  // Get available quantities from items
  const getAvailableQuantities = () => {
    if (!products.items || products.items.length === 0) {
      return [{ id: 1, quantity_in_grams: "250", price: getLowestPrice() }];
    }

    return products.items.map((item) => ({
      id: item.id,
      quantity_in_grams: item.quantity_in_grams,
      price: parseFloat(item.discounted_price || item.price || 0),
    }));
  };

  const availableQuantities = getAvailableQuantities();
  const lowestPrice = getLowestPrice();

  // Set default selected item when component mounts or product changes
  useEffect(() => {
    if (availableQuantities.length > 0 && !selectedItem) {
      setSelectedItem(availableQuantities[0]);
    }
  }, [products, availableQuantities, selectedItem]);

  const getReview = async () => {
    try {
      const res = await fetch(
        `${API_URL}/cms/ratings/?content_type=10&object_id=${id}`,
        {
          redirect: "follow",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          await signOut();
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const list = data?.results || [];
      setReviews(list);
      if (Array.isArray(list) && list.length > 0) {
        const sum = list.reduce((acc, r) => acc + Number(r.rating || 0), 0);
        setAverageRating(sum / list.length);
      } else {
        setAverageRating(0);
      }
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  const getFaqs = async () => {
    setFaqsLoading(true);
    try {
      const res = await fetch(`${API_URL}/cms/faqs/`, {
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
      // Handle both array response and paginated response
      const faqData = Array.isArray(data) ? data : data.results || [];
      setFaqs(faqData);
    } catch (err) {
      console.log("Error fetching FAQs:", err);
      setFaqs([]); // Set empty array on error
    } finally {
      setFaqsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      if (!session?.access_token) return;
      const res = await fetch(`${API_URL}/iam/users/me/`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) return null;
      const data = await res.json();
      // Use `user` field which maps to Django User id
      if (data?.user) {
        setCurrentUserId(data.user);
        return data.user;
      }
      return null;
    } catch (e) {
      console.error("Failed to fetch current user:", e);
      return null;
    }
  };

  const submitReview = async () => {
    if (!session?.access_token) {
      router.push("/login");
      return;
    }
    const userId = currentUserId || (await fetchCurrentUser());
    if (!userId) {
      alert("Could not determine current user. Please re-login and try again.");
      return;
    }
    // Basic validation
    const ratingNum = Number(ratingValue);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    if (!reviewText || reviewText.trim().length < 5) {
      alert("Please enter a review of at least 5 characters.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/cms/ratings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          user: Number(userId),
          rating: ratingNum,
          review: reviewText.trim(),
          object_id: Number(id),
          content_type: 10,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.detail || "Failed to submit review");
      }
      // Refresh reviews and close
      await getReview();
      setIsRatingModalOpen(false);
      setRatingValue(5);
      setReviewText("");
    } catch (e) {
      console.error("Submit review error:", e);
      alert(e.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK loaded");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up the script when component unmounts
    };
  }, []);

  const getProduct = async () => {
    setLoading(true); // ✅ Set loading before fetching
    try {
      const res = await fetch(`${API_URL}/cms/products/${id}/`, {
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      console.log("data ===>", data);
      console.log("Product thumbnail URL:", data.thumbnail);
      console.log("Product images:", data.images);
      setProducts(data);
      setSelectedImage(
        normalizeImageUrl(
          data.thumbnail ||
            (data.images?.length > 0 ? data.images[0].image : null)
        )
      );
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });

  useEffect(() => {
    getProduct();
    getReview();
    getFaqs();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Default to thumbnail if available, otherwise pick first image
    if (products.thumbnail) {
      setSelectedImage(products.thumbnail);
    } else if (products.images?.length > 0) {
      setSelectedImage(products.images[0].image);
    }
  }, [products]);

  // Reset error state whenever image source changes
  useEffect(() => {
    setImageError(false);
  }, [selectedImage, products?.thumbnail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  // Debug helper was removed: using `new Image()` conflicts with Next.js Image import

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          {/* Image Gallery with Clickable Thumbnails */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image Selector - Always visible on all screens */}
            <div className="mt-2 w-full">
              <TabList className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:justify-start">
                {/* Always show the product thumbnail as the first image */}
                {products.thumbnail && (
                  <Tab
                    key="thumbnail"
                    onClick={() => setSelectedImage(products.thumbnail)} // ✅ Updates Main Image
                    className="group relative flex h-16 w-16 sm:h-20 sm:w-20 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    <span className="sr-only">{products.title}</span>
                    <div className="relative h-full w-full overflow-hidden rounded-md">
                      <Image
                        alt="Product Thumbnail"
                        src={products.thumbnail}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                    />
                  </Tab>
                )}

                {/* Product images */}
                {products.images?.length > 0 &&
                  products.images.map((image) => (
                    <Tab
                      key={image.id}
                      onClick={() => setSelectedImage(image.image)} // ✅ Updates Main Image
                      className="group relative flex h-16 w-16 sm:h-20 sm:w-20 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      <span className="sr-only">{products.title}</span>
                      <div className="relative h-full w-full overflow-hidden rounded-md">
                        <Image
                          alt={image.alt_text || "Product image"}
                          src={image.image}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                      />
                    </Tab>
                  ))}
              </TabList>
            </div>

            {/* Main Image Display */}
            <TabPanels className="w-full">
              <div className="relative w-full sm:h-[420px] h-[300px] overflow-hidden rounded-lg">
                {imageError ? (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-lg">
                    <div className="text-center text-gray-500">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-2 text-sm">Image not available</p>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const mainImageSrc = normalizeImageUrl(
                      selectedImage ||
                        products?.thumbnail ||
                        (products?.images?.length > 0
                          ? products.images[0].image
                          : null)
                    );
                    if (!mainImageSrc) {
                      return (
                        <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />
                      );
                    }
                    return (
                      <Image
                        alt="Selected Product Image"
                        src={mainImageSrc}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover object-center sm:rounded-lg"
                        onError={() => setImageError(true)}
                      />
                    );
                  })()
                )}
              </div>
            </TabPanels>
          </TabGroup>
          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {products.title}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                ₹{new Intl.NumberFormat("en-IN").format(lowestPrice)}
                <span className="text-lg text-gray-500 ml-2">
                  for {availableQuantities[0]?.quantity_in_grams}g
                </span>
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((r) => (
                    <StarIcon
                      key={r}
                      aria-hidden="true"
                      className={classNames(
                        (averageRating || 0) > r
                          ? "text-yellow-400"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {Number(averageRating || 0).toFixed(1)} / 5
                </span>
                {Array.isArray(reviews) && (
                  <span className="text-sm text-gray-500">
                    ({reviews.length} reviews)
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                dangerouslySetInnerHTML={{ __html: products.description }}
                className="space-y-6 text-base text-gray-700"
              />
            </div>

            <form className="mt-6">
              {/* Colors */}
              {/* <div>
                <h3 className="text-sm font-medium text-gray-600">Color</h3>

                <fieldset aria-label="Choose a color" className="mt-2">
                  <RadioGroup
                    value={selectedColor}
                    onChange={setSelectedColor}
                    className="flex items-center space-x-3"
                  >
                    {product.colors.map((color) => (
                      <Radio
                        key={color.name}
                        value={color}
                        aria-label={color.name}
                        className={classNames(
                          color.selectedColor,
                          "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            color.bgColor,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div> */}

              {/* Removed old dropdown and units stepper in favor of compact rows */}

              {/* Variant quick add rows */}
              {availableQuantities.length > 0 && (
                <div className="mt-6 space-y-3">
                  {availableQuantities.map((item) => {
                    const grams = Number(item.quantity_in_grams || 0);
                    const per100 = grams > 0 ? (item.price / grams) * 100 : 0;
                    const qty = itemQuantities[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 line-through text-sm hidden" />
                            <span className="text-lg font-semibold text-gray-900">
                              ₹
                              {new Intl.NumberFormat("en-IN").format(
                                item.price
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            ₹{per100.toFixed(1)}/100 g ·{" "}
                            {item.quantity_in_grams}g
                          </div>
                        </div>
                        {qty <= 0 ? (
                          <button
                            type="button"
                            className="text-indigo-600 font-semibold hover:text-indigo-700"
                            onClick={() => {
                              const nextQty = 1;
                              setItemQuantities((prev) => ({
                                ...prev,
                                [item.id]: nextQty,
                              }));
                              if (!accessToken) {
                                router.push("/login");
                              } else {
                                const payload = {
                                  ...products,
                                  selectedItem: item,
                                  quantity: nextQty,
                                };
                                addToCart(payload);
                              }
                            }}
                          >
                            ADD
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-4 text-indigo-600">
                            <button
                              type="button"
                              className="text-xl px-2"
                              onClick={() => {
                                const next = Math.max(0, qty - 1);
                                setItemQuantities((prev) => ({
                                  ...prev,
                                  [item.id]: next,
                                }));
                                if (next > 0) {
                                  if (!accessToken) {
                                    router.push("/login");
                                  } else {
                                    const payload = {
                                      ...products,
                                      selectedItem: item,
                                      quantity: next,
                                    };
                                    addToCart(payload);
                                  }
                                }
                              }}
                              aria-label="Decrease"
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] text-center font-semibold text-gray-900">
                              {qty}
                            </span>
                            <button
                              type="button"
                              className="text-xl px-2"
                              onClick={() => {
                                const next = qty + 1;
                                setItemQuantities((prev) => ({
                                  ...prev,
                                  [item.id]: next,
                                }));
                                if (!accessToken) {
                                  router.push("/login");
                                } else {
                                  const payload = {
                                    ...products,
                                    selectedItem: item,
                                    quantity: next,
                                  };
                                  addToCart(payload);
                                }
                              }}
                              aria-label="Increase"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-10 flex space-x-1">
                {/* <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  onClick={() => processPayment(products)}
                >
                  Purchase Now
                </button> */}

                <button
                  type="button"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProductAddingToCart(products.id)}
                  onClick={() => {
                    if (!accessToken) {
                      router.push("/login"); // ✅ Redirects to login if user is not authenticated
                    } else {
                      const productWithQuantity = {
                        ...products,
                        selectedItem: selectedItem || availableQuantities[0],
                        quantity: selectedQuantity,
                      };
                      addToCart(productWithQuantity);
                    }
                  }}
                >
                  {isProductAddingToCart(products.id) ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                <button
                  type="button"
                  className="ml-2 flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
                  onClick={() => {
                    if (!session?.access_token) {
                      router.push("/login");
                    } else {
                      setIsRatingModalOpen(true);
                    }
                  }}
                >
                  Write a review
                </button>
              </div>
            </form>

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t">
                {products.details?.map((detail) => (
                  <Disclosure key={detail.name} as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-gray-900 group-data-[open]:text-indigo-600">
                          {detail.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="prose prose-sm pb-6">
                      <ul role="list">
                        {detail.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </div>
            </section>
          </div>
          <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
            {/* Write Review Modal */}
            {isRatingModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Write a review
                    </h3>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setIsRatingModalOpen(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your rating
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRatingValue(n)}
                            className="p-1"
                            aria-label={`Rate ${n} star`}
                          >
                            <svg
                              className={`h-6 w-6 ${
                                n <= Number(ratingValue)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your review
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                      onClick={() => setIsRatingModalOpen(false)}
                      disabled={isSubmittingReview}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      onClick={submitReview}
                      disabled={isSubmittingReview}
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <TabGroup>
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8">
                  <Tab className="whitespace-nowrap border-b-2 border-transparent py-6 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                    Customer Reviews
                  </Tab>
                  <Tab className="whitespace-nowrap border-b-2 border-transparent py-6 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                    FAQ
                  </Tab>
                  {/* <Tab className="whitespace-nowrap border-b-2 border-transparent py-6 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-800 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600">
                    License
                  </Tab> */}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                <TabPanel className="-mb-10">
                  <h3 className="sr-only">Customer Reviews</h3>

                  {Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.map((review, reviewIdx) => (
                      <div
                        key={review.id}
                        className="flex space-x-4 text-sm text-gray-500"
                      >
                        <div className="flex-none py-10">
                          {(() => {
                            const profile = review?.user?.profile || {};
                            const avatarUrl = profile?.avatar;
                            const firstName = profile?.first_name || "";
                            const lastName = profile?.last_name || "";
                            const firstInitial = (
                              firstName?.[0] || "?"
                            ).toUpperCase();
                            const lastInitial = (
                              lastName?.[0] || ""
                            ).toUpperCase();
                            if (avatarUrl) {
                              return (
                                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                  <Image
                                    alt="User Avatar"
                                    src={normalizeImageUrl(avatarUrl)}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                </div>
                              );
                            }
                            return (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                                {firstInitial}
                                {lastInitial}
                              </div>
                            );
                          })()}
                        </div>

                        <div
                          className={classNames(
                            reviewIdx === 0 ? "" : "border-t border-gray-200",
                            "py-10"
                          )}
                        >
                          <h3 className="text-base font-semibold text-gray-900">
                            {review?.user?.profile?.first_name || "User"}{" "}
                            {review?.user?.profile?.last_name || ""}
                          </h3>
                          <p>
                            <time dateTime={review.created_at}>
                              {formatDateToHumanReadable(review.created_at)}
                            </time>
                          </p>

                          <div className="mt-4 flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <StarIcon
                                key={rating}
                                aria-hidden="true"
                                className={classNames(
                                  (review.rating || 0) > rating
                                    ? "text-yellow-400"
                                    : "text-gray-300",
                                  "h-5 w-5 flex-shrink-0"
                                )}
                              />
                            ))}
                          </div>
                          <p className="sr-only">
                            {review.rating} out of 5 stars
                          </p>

                          <div
                            dangerouslySetInnerHTML={{ __html: review.review }}
                            className="prose prose-sm mt-4 max-w-none text-gray-500"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-sm text-gray-500">
                      No reviews yet. Be the first to review this product.
                    </div>
                  )}
                </TabPanel>

                <TabPanel className="text-sm text-gray-500">
                  <h3 className="sr-only">Frequently Asked Questions</h3>

                  {faqsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
                      <span className="ml-3 text-sm text-gray-600">
                        Loading FAQs...
                      </span>
                    </div>
                  ) : faqs.length > 0 ? (
                    <dl>
                      {faqs.map((faq) => (
                        <Fragment key={faq.id}>
                          <dt className="mt-10 font-medium text-gray-900">
                            {faq.question}
                          </dt>
                          <dd className="prose prose-sm mt-2 max-w-none text-gray-500">
                            <p>{faq.answer}</p>
                          </dd>
                        </Fragment>
                      ))}
                    </dl>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          className="w-full h-full"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No FAQs Available
                      </h3>
                      <p className="text-gray-600">
                        There are currently no frequently asked questions for
                        this product.
                      </p>
                    </div>
                  )}
                </TabPanel>

                <TabPanel className="pt-10">
                  <h3 className="sr-only">License</h3>

                  {/* <div
                    dangerouslySetInnerHTML={{ __html: license.content }}
                    className="prose prose-sm max-w-none text-gray-500"
                  /> */}
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
