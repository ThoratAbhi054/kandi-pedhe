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
  getImageUrl,
} from "../../../utils/constant";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { useSupabase } from "../../../context/SupabaseContext";
import { useCart } from "../../../context/CartContext"; // ✅ Import Cart Context

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

function formatDateToHumanReadable(dateString) {
  return new Date(dateString).toLocaleString("en-IN", {
    weekday: "long", // Weekday, e.g. Monday
    year: "numeric", // Year, e.g. 2024
    month: "long", // Month, e.g. November
    day: "numeric", // Day of the month, e.g. 27
    hour: "numeric", // Hour, e.g. 23
    minute: "numeric", // Minute, e.g. 59
    second: "numeric", // Second, e.g. 12
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
  const [faqs, setFaqs] = useState([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const accessToken = session?.access_token;
  const { addToCart, isProductAddingToCart } = useCart(); // ✅ Use `addToCart` and loading state
  console.log("license  ===>", products);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [faqsLoading, setFaqsLoading] = useState(true); // ✅ FAQs Loading state

  const getReview = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/ratings/?object_id=${id}`, {
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
      setReviews(data?.results || []);
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
      setProducts(data);
      setSelectedImage(
        getImageUrl(data.thumbnail) ||
          (data.images?.length > 0 ? getImageUrl(data.images[0].image) : null)
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
  }, []);

  useEffect(() => {
    // Default to thumbnail if available, otherwise pick first image
    if (products.thumbnail) {
      setSelectedImage(getImageUrl(products.thumbnail));
    } else if (products.images?.length > 0) {
      setSelectedImage(getImageUrl(products.images[0].image));
    }
  }, [products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          {/* Image Gallery with Clickable Thumbnails */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image Selector - Always visible on all screens */}
            <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-2 sm:flex sm:justify-center overflow-x-auto sm:overflow-hidden">
                {/* Always show the product thumbnail as the first image */}
                {products.thumbnail && (
                  <Tab
                    key="thumbnail"
                    onClick={() =>
                      setSelectedImage(getImageUrl(products.thumbnail))
                    } // ✅ Updates Main Image
                    className="group relative flex h-20 w-20 sm:h-24 sm:w-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    <span className="sr-only">{products.title}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img
                        alt="Product Thumbnail"
                        src={getImageUrl(products.thumbnail)}
                        className="h-full w-full object-cover object-center"
                      />
                    </span>
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
                      onClick={() => setSelectedImage(getImageUrl(image.image))} // ✅ Updates Main Image
                      className="group relative flex h-20 w-20 sm:h-24 sm:w-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      <span className="sr-only">{products.title}</span>
                      <span className="absolute inset-0 overflow-hidden rounded-md">
                        <img
                          alt={image.alt_text || "Product image"}
                          src={getImageUrl(image.image)}
                          className="h-full w-full object-cover object-center"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                      />
                    </Tab>
                  ))}
              </TabList>
            </div>

            {/* Main Image Display */}
            <TabPanels className="aspect-h-1 aspect-w-1 w-full">
              <div className="h-full">
                {" "}
                {/* Add a container div */}
                <img
                  alt="Selected Product Image"
                  src={
                    selectedImage ||
                    getImageUrl(products.thumbnail) ||
                    "/fallback-image.jpg"
                  }
                  className="h-full w-full object-cover object-center sm:rounded-lg"
                />
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
                ₹{" "}
                {new Intl.NumberFormat("en-IN").format(
                  products.discounted_price
                )}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        (products.rating || 0) > rating
                          ? "text-yellow-400"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {Number(products.rating || 0).toFixed(1)} / 5
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
                      addToCart(products);
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
                  className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  onClick={() => setIsRatingModalOpen(true)}
                >
                  <HeartIcon
                    aria-hidden="true"
                    className="h-6 w-6 flex-shrink-0"
                  />
                  <span className="sr-only">Add to favorites</span>
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
                          {review.user?.avatar ? (
                            <img
                              alt="User Avatar"
                              src={review.user.avatar}
                              className="h-10 w-10 rounded-full text-gray-700"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                              {review.user?.first_name?.[0] || "?"}
                              {review.user?.last_name?.[0] || ""}
                            </div>
                          )}
                        </div>

                        <div
                          className={classNames(
                            reviewIdx === 0 ? "" : "border-t border-gray-200",
                            "py-10"
                          )}
                        >
                          <h3 className="font-medium text-gray-900">
                            {review.user?.first_name} {review.user?.last_name}
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
