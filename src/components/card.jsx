"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";
import Link from "next/link";

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
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={clsx(
          "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
          className
        )}
        {...props}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
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
  const discount =
    product.original_price && product.discounted_price
      ? Math.round(
          ((product.original_price - product.discounted_price) /
            product.original_price) *
            100
        )
      : null;

  return (
    <Card
      ref={ref}
      href={`/products/${product.id}`}
      className={clsx("w-full max-w-sm", className)}
      {...props}
    >
      <CardImage
        src={product.thumbnail}
        alt={product.title}
        className="aspect-[4/3]"
      />
      <CardContent>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <CardPrice
          price={product.discounted_price || product.price}
          originalPrice={product.original_price}
          discount={discount}
        />
        {showAddToCart && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="btn btn-primary btn-sm w-full mt-4"
          >
            Add to Cart
          </button>
        )}
      </CardContent>
    </Card>
  );
});

const CategoryCard = forwardRef(function CategoryCard(
  { category, className, ...props },
  ref
) {
  return (
    <Card
      ref={ref}
      href={`/categories/${category.id}`}
      className={clsx("w-full max-w-sm", className)}
      {...props}
    >
      <CardImage
        src={category.thumbnail}
        alt={category.name}
        className="aspect-[4/3]"
      />
      <CardContent>
        <CardTitle>{category.name}</CardTitle>
        {category.description && (
          <CardDescription>{category.description}</CardDescription>
        )}
      </CardContent>
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
