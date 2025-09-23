"use client";

import { forwardRef, useState, useEffect } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

const Card = forwardRef(function Card(
  {
    className,
    children,
    hover = true,
    clickable = false,
    href,
    onClick,
    ...props
  },
  ref
) {
  const Component = href ? Link : clickable ? "button" : "div";

  const baseClasses = clsx(
    "card group relative overflow-hidden",
    hover && "card-hover",
    clickable &&
      "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    className
  );

  return (
    <Component
      ref={ref}
      className={baseClasses}
      href={href}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
});

const CardHeader = forwardRef(function CardHeader(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={clsx("p-6 pb-4", className)} {...props} />;
});

const CardContent = forwardRef(function CardContent(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={clsx("p-6 pt-0", className)} {...props} />;
});

const CardFooter = forwardRef(function CardFooter(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx("p-6 pt-4 border-t border-gray-100", className)}
      {...props}
    />
  );
});

const CardImage = forwardRef(function CardImage(
  { className, src, alt = "", aspectRatio = "aspect-square", ...props },
  ref
) {
  return (
    <div className={clsx("relative overflow-hidden", aspectRatio)}>
      <Image
        ref={ref}
        src={src}
        alt={alt || ""}
        width={400}
        height={300}
        className={clsx(
          "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
          className
        )}
        {...props}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
});

const CardTitle = forwardRef(function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={clsx(
        "text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
});

const CardDescription = forwardRef(function CardDescription(
  { className, ...props },
  ref
) {
  return (
    <p
      ref={ref}
      className={clsx("text-sm text-gray-600 mt-1 line-clamp-2", className)}
      {...props}
    />
  );
});

const CardPrice = forwardRef(function CardPrice(
  { className, price, originalPrice, discount, currency = "₹", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx("flex items-center gap-2 mt-2", className)}
      {...props}
    >
      <span className="text-lg font-bold text-gray-900">
        {currency} {new Intl.NumberFormat("en-IN").format(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className="text-sm text-gray-500 line-through">
            {currency} {new Intl.NumberFormat("en-IN").format(originalPrice)}
          </span>
          {discount && (
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
});

const ProductCard = forwardRef(function ProductCard(
  { product, className, showAddToCart = true, onAddToCart, ...props },
  ref
) {
  const { isProductAddingToCart } = useCart();
  const isAddingToCart = isProductAddingToCart(product.id);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});
  const [showVariants, setShowVariants] = useState(false);

  // Get the lowest price from items array
  const getLowestPrice = () => {
    if (!product.items || product.items.length === 0) {
      return product.discounted_price || product.price || 0;
    }

    const lowestPriceItem = product.items.reduce((min, item) => {
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
    if (!product.items || product.items.length === 0) {
      return [{ id: 1, quantity_in_grams: "250", price: getLowestPrice() }];
    }

    return product.items.map((item) => ({
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
  }, [product, availableQuantities, selectedItem]);

  const discount =
    product.original_price && product.discounted_price
      ? Math.round(
          ((product.original_price - product.discounted_price) /
            product.original_price) *
            100
        )
      : null;

  const isNew =
    product.created_at &&
    new Date(product.created_at) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <Card
      ref={ref}
      href={`/products/${product.id}`}
      className={clsx(
        "group relative w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col",
        className
      )}
      {...props}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <CardImage
          src={product.thumbnail}
          alt={product.title}
          className="aspect-[4/3] w-full"
        />

        {/* Product Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500 text-white shadow-lg">
              -{discount}%
            </span>
          )}
          {isNew && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Add wishlist logic here
            console.log("Added to wishlist:", product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg"
          aria-label="Add to wishlist"
        >
          <svg
            className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add quick view logic here
              console.log("Quick view:", product);
            }}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm shadow-lg hover:bg-gray-100"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Product Title */}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Product Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating (if available) */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">
              ({product.rating_count || 0})
            </span>
          </div>
        )}

        {/* Pricing and CTA */}
        {availableQuantities.length <= 1 ? (
          <div className="space-y-2 mb-4">
            {availableQuantities.map((item) => {
              const grams = Number(item.quantity_in_grams || 0);
              const per100 = grams > 0 ? (item.price / grams) * 100 : 0;
              const qty = itemQuantities[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2"
                >
                  <div>
                    <div className="text-base font-semibold text-gray-900">
                      ₹{new Intl.NumberFormat("en-IN").format(item.price)}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      ₹{per100.toFixed(1)}/100 g · {item.quantity_in_grams}g
                    </div>
                  </div>
                  {qty <= 0 ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const next = 1;
                        setItemQuantities((prev) => ({
                          ...prev,
                          [item.id]: next,
                        }));
                        onAddToCart?.({
                          ...product,
                          selectedItem: item,
                          quantity: next,
                        });
                      }}
                      className="text-sm font-semibold text-indigo-600"
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-3 text-indigo-600">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const next = Math.max(
                            0,
                            (itemQuantities[item.id] || 0) - 1
                          );
                          setItemQuantities((prev) => ({
                            ...prev,
                            [item.id]: next,
                          }));
                          if (next > 0) {
                            onAddToCart?.({
                              ...product,
                              selectedItem: item,
                              quantity: next,
                            });
                          }
                        }}
                        className="text-lg px-2"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center font-semibold text-gray-900">
                        {qty}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const next = (itemQuantities[item.id] || 0) + 1;
                          setItemQuantities((prev) => ({
                            ...prev,
                            [item.id]: next,
                          }));
                          onAddToCart?.({
                            ...product,
                            selectedItem: item,
                            quantity: next,
                          });
                        }}
                        className="text-lg px-2"
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
        ) : (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{new Intl.NumberFormat("en-IN").format(lowestPrice)}
              </span>
              <button
                type="button"
                className="text-sm text-gray-500 inline-flex items-center gap-1 hover:text-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowVariants(true);
                }}
                aria-label="Show pack options"
              >
                for {availableQuantities[0]?.quantity_in_grams}g
                <svg
                  className="w-3 h-3 text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowVariants(true);
              }}
              className="text-sm font-semibold text-indigo-600"
            >
              ADD
            </button>
          </div>
        )}

        {/* Variant picker modal for multi-variant products */}
        {showVariants && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowVariants(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold text-gray-900">
                  Select a pack
                </h4>
                <button
                  className="text-gray-500"
                  onClick={() => setShowVariants(false)}
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {availableQuantities.map((item) => {
                  const grams = Number(item.quantity_in_grams || 0);
                  const per100 = grams > 0 ? (item.price / grams) * 100 : 0;
                  const qty = itemQuantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2"
                    >
                      <div>
                        <div className="text-base font-semibold text-gray-900">
                          ₹{new Intl.NumberFormat("en-IN").format(item.price)}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          ₹{per100.toFixed(1)}/100 g · {item.quantity_in_grams}g
                        </div>
                      </div>
                      {qty <= 0 ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const next = 1;
                            setItemQuantities((prev) => ({
                              ...prev,
                              [item.id]: next,
                            }));
                          }}
                          className="text-sm font-semibold text-indigo-600"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-3 text-indigo-600">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const next = Math.max(
                                0,
                                (itemQuantities[item.id] || 0) - 1
                              );
                              setItemQuantities((prev) => ({
                                ...prev,
                                [item.id]: next,
                              }));
                            }}
                            className="text-lg px-2"
                          >
                            −
                          </button>
                          <span className="min-w-[1.5rem] text-center font-semibold text-gray-900">
                            {qty}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const next = (itemQuantities[item.id] || 0) + 1;
                              setItemQuantities((prev) => ({
                                ...prev,
                                [item.id]: next,
                              }));
                            }}
                            className="text-lg px-2"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">
                  Item total: ₹
                  {new Intl.NumberFormat("en-IN").format(
                    availableQuantities.reduce(
                      (sum, it) =>
                        sum +
                        (itemQuantities[it.id] || 0) * Number(it.price || 0),
                      0
                    )
                  )}
                </div>
                <button
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    availableQuantities.forEach((it) => {
                      const qty = itemQuantities[it.id] || 0;
                      if (qty > 0) {
                        onAddToCart?.({
                          ...product,
                          selectedItem: it,
                          quantity: qty,
                        });
                      }
                    });
                    setShowVariants(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});

const CategoryCard = forwardRef(function CategoryCard(
  { category, className, ...props },
  ref
) {
  const productCount = category.product_count || 0;
  const isPopular = productCount > 50; // Consider popular if more than 50 products
  const isNew =
    category.created_at &&
    new Date(category.created_at) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // New if created within 30 days

  return (
    <Card
      ref={ref}
      href={`/categories/${category.id}`}
      className={clsx(
        "group relative w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Category Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <CardImage
          src={category.thumbnail}
          alt={category.name}
          className="aspect-[4/3] w-full"
        />

        {/* Category Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isPopular && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500 text-white shadow-lg">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Popular
            </span>
          )}
          {isNew && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
              NEW
            </span>
          )}
        </div>

        {/* Product Count Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg">
            {productCount} items
          </span>
        </div>

        {/* Explore Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Navigate to category
              window.location.href = `/categories/${category.id}`;
            }}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-gray-100 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            Explore Category
          </button>
        </div>
      </div>

      {/* Category Content */}
      <div className="p-5">
        {/* Category Title */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
          {category.name}
        </h3>

        {/* Category Description */}
        {category.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}

        {/* Category Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              {productCount} Products
            </span>
            {category.is_featured && (
              <span className="flex items-center gap-1 text-orange-500">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            )}
          </div>
        </div>

        {/* View Category Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/categories/${category.id}`;
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            View Category
          </span>
        </button>
      </div>
    </Card>
  );
});

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardImage,
  CardTitle,
  CardDescription,
  CardPrice,
  ProductCard,
  CategoryCard,
};
