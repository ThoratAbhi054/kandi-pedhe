"use client";

import { forwardRef } from "react";
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
  { className, src, alt, aspectRatio = "aspect-square", ...props },
  ref
) {
  return (
    <div className={clsx("relative overflow-hidden", aspectRatio)}>
      <Image
        ref={ref}
        src={src}
        alt={alt}
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
        "group relative w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden",
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
      <div className="p-5">
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

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹
              {new Intl.NumberFormat("en-IN").format(
                product.discounted_price || product.price
              )}
            </span>
            {product.original_price &&
              product.original_price >
                (product.discounted_price || product.price) && (
                <span className="text-sm text-gray-500 line-through">
                  ₹
                  {new Intl.NumberFormat("en-IN").format(
                    product.original_price
                  )}
                </span>
              )}
          </div>
        </div>

        {/* Add to Cart Button */}
        {showAddToCart && (
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                await onAddToCart?.(product);
                // The toast notification will be handled by the cart context
              } catch (error) {
                console.error("Error adding to cart:", error);
              }
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isAddingToCart}
          >
            <span className="flex items-center justify-center gap-2">
              {isAddingToCart ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                <>
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                  Add to Cart
                </>
              )}
            </span>
          </button>
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
