"use client"; // Important for Next.js App Router

import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../utils/constant";
import { AuthActions } from "../app/auth/utils";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { getToken } = AuthActions();
  const accessToken = getToken("access");
  console.log("accessToken cart ==>", accessToken);

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart items from API
  const fetchCart = async () => {
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
  };

  const addToCart = async (product) => {
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
      fetchCart(); // Re-fetch cart after adding an item
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, fetchCart }}>
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
