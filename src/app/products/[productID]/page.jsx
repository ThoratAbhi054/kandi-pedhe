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
import { signOut } from "next-auth/react";
import { AuthActions } from "../../../app/auth/utils";
import { useCart } from "../../../context/CartContext"; // ✅ Import Cart Context

const faqs = [
  {
    question: "What format are these icons?",
    answer:
      "The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.",
  },
  {
    question: "Can I use the icons at different sizes?",
    answer:
      "Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
  },
  // More FAQs...
];
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
const product = {
  name: "Zip Tote Basket",
  price: "$140",
  rating: 4,
  images: [
    {
      id: 1,
      name: "Angled view",
      src: "https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg",
      alt: "Angled front view with bag zipped and handles upright.",
    },
    // More images...
  ],
  colors: [
    {
      name: "Washed Black",
      bgColor: "bg-gray-700",
      selectedColor: "ring-gray-700",
    },
    { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
    {
      name: "Washed Gray",
      bgColor: "bg-gray-500",
      selectedColor: "ring-gray-500",
    },
  ],
  description: `
    <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
  `,
  details: [
    {
      name: "Product Information",
      items: [
        "Multiple strap configurations",
        "Spacious interior with top zip",
        "Leather handle and tabs",
        "Interior dividers",
        "Stainless strap loops",
        "Double stitched construction",
        "Water-resistant",
      ],
    },
    // More sections...
  ],
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
  const { getToken, logout, removeTokens } = AuthActions();
  const router = useRouter();
  const id = params?.params?.productID;
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const searchParams = useSearchParams();
  const [products, setProducts] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const accessToken = getToken("access");
  const { addToCart } = useCart(); // ✅ Use `addToCart`
  console.log("access token in rating ===>", accessToken);
  const getReview = async () => {
    try {
      const res = await fetch(`${API_URL}/cms/ratings/`, {
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          object_id: id,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          await signOut();
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setReviews(data?.results);
    } catch (err) {
      console.log("Error fetching data:", err);
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
    try {
      const res = await fetch(`${API_URL}/cms/products/${id}/`, {
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

  const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });

  useEffect(() => {
    getProduct();
    getReview();
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {products.images?.map((image) => (
                  <Tab
                    key={image.id}
                    className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    <span className="sr-only">{products.title}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img
                        alt={image.alt_text || "Product image"}
                        src={`${API_URL}${image.image}`} // ✅ Ensure the correct URL format
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
              {products.images?.length > 0 ? (
                products.images.map((image) => (
                  <TabPanel key={image.id}>
                    <img
                      alt={image.alt_text || "Product image"}
                      src={`${API_URL}${image.image}`} // ✅ Ensure the correct URL format
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </TabPanel>
                ))
              ) : (
                // Show thumbnail when no images are available
                <TabPanel>
                  <img
                    alt="Default product image"
                    src={products.thumbnail}
                    className="h-full w-full object-cover object-center sm:rounded-lg"
                  />
                </TabPanel>
              )}
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
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        product.rating > rating
                          ? "text-indigo-500"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
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
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  onClick={() => addToCart(products)}
                >
                  Add to Cart
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
                {product.details.map((detail) => (
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

                  {reviews.map((review, reviewIdx) => (
                    <div
                      key={review.id}
                      className="flex space-x-4 text-sm text-gray-500"
                    >
                      <div className="flex-none py-10">
                        {review.user.avatar ? (
                          <img
                            alt="User Avatar"
                            src={review.user.avatar}
                            className="h-10 w-10 rounded-full text-gray-700"
                          />
                        ) : (
                          // If avatar is null, show initials of first and last name
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-white font-bold">
                            {/* {review.user?.first_name[0]?.toUpperCase()}
                            {review.user?.last_name[0]?.toUpperCase()} */}
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
                          {review.user.first_name} {review.user.last_name}
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
                                review.rating > rating
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
                  ))}
                </TabPanel>

                <TabPanel className="text-sm text-gray-500">
                  <h3 className="sr-only">Frequently Asked Questions</h3>

                  <dl>
                    {products.faqs?.map((faq) => (
                      <Fragment key={faq.question}>
                        <dt className="mt-10 font-medium text-gray-900">
                          {faq.question}
                        </dt>
                        <dd className="prose prose-sm mt-2 max-w-none text-gray-500">
                          <p>{faq.answer}</p>
                        </dd>
                      </Fragment>
                    ))}
                  </dl>
                </TabPanel>

                <TabPanel className="pt-10">
                  <h3 className="sr-only">License</h3>

                  <div
                    dangerouslySetInnerHTML={{ __html: license.content }}
                    className="prose prose-sm max-w-none text-gray-500"
                  />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
