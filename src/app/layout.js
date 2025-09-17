"use client"; // ✅ Important for Client Component
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import LayoutComponent from "../components/LayoutComponent"; // ✅ Create a separate layout component
import CartToastConnector from "../components/CartToastConnector";
import { SupabaseProvider } from "../context/SupabaseContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <ToastProvider>
            <CartProvider>
              <CartToastConnector />
              <LayoutComponent>{children}</LayoutComponent>
            </CartProvider>
          </ToastProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
