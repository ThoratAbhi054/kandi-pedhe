"use client"; // Important for Next.js App Router

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../utils/constant";
import { useSupabase } from "./SupabaseContext";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { session } = useSupabase();
  const accessToken = session?.access_token;
  const router = useRouter();
  console.log("accessToken cart ==>", accessToken);

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [addingToCartProducts, setAddingToCartProducts] = useState(new Set());

  // We'll use a ref to store the toast function to avoid circular dependency
  const [toastFunctions, setToastFunctions] = useState(null);

  // Fetch cart items from API
  const fetchCart = useCallback(async () => {
    if (!accessToken) return;

    try {
      const res = await fetch(`${API_URL}/cms/carts/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCart(data);
      setCartCount(
        data.reduce((total, cartItem) => total + cartItem.items.length, 0)
      );
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }, [accessToken]);

  const addToCart = async (product, showToast = true) => {
    if (addingToCartProducts.has(product.id)) return; // Prevent multiple simultaneous additions for the same product

    // Check if user is authenticated
    if (!accessToken) {
      // Show info toast about needing to login
      if (showToast && toastFunctions) {
        toastFunctions.showError(
          "Please log in to add items to your cart.",
          "Login Required",
          3000
        );
      }
      // Redirect to login page
      router.push("/login");
      return;
    }

    // Add product to loading set
    setAddingToCartProducts((prev) => new Set([...prev, product.id]));

    try {
      const payload = {
        content_type: "product",
        object_id: product.id,
      };

      const response = await fetch(`${API_URL}/cms/carts/add/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.statusText}`);
      }

      await response.json();
      await fetchCart(); // Re-fetch cart after adding an item

      // Show success toast if requested
      if (showToast && toastFunctions) {
        toastFunctions.showSuccess(
          `${product.title} has been added to your cart.`,
          "Added to Cart!",
          3000
        );
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      if (showToast && toastFunctions) {
        toastFunctions.showError(
          `Could not add ${product.title} to cart. Please try again.`,
          "Failed to Add",
          4000
        );
      }
    } finally {
      // Remove product from loading set
      setAddingToCartProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  // Helper function to check if a specific product is being added to cart
  const isProductAddingToCart = (productId) => {
    return addingToCartProducts.has(productId);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        fetchCart,
        isProductAddingToCart,
        setToastFunctions,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to Use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
