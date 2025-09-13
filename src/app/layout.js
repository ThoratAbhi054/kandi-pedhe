"use client"; // ✅ Important for Client Component
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import LayoutComponent from "../components/LayoutComponent"; // ✅ Create a separate layout component
import CartToastConnector from "../components/CartToastConnector";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <CartProvider>
            <CartToastConnector />
            <LayoutComponent>{children}</LayoutComponent>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
