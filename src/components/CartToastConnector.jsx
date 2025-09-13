"use client";

import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const CartToastConnector = () => {
  const { setToastFunctions } = useCart();
  const toast = useToast();

  useEffect(() => {
    // Connect the toast functions to the cart context
    setToastFunctions(toast);
  }, [setToastFunctions, toast]);

  return null; // This component doesn't render anything
};

export default CartToastConnector;
