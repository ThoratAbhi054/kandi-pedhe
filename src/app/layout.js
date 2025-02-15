"use client"; // ✅ Important for Client Component
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import LayoutComponent from "../components/LayoutComponent"; // ✅ Create a separate layout component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {" "}
          {/* ✅ Wrap inside CartProvider */}
          <LayoutComponent>{children}</LayoutComponent>
        </CartProvider>
      </body>
    </html>
  );
}
