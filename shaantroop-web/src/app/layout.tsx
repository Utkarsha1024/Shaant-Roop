import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shaant Roop — Natural, Handcrafted Skincare",
  description:
    "Discover Shaant Roop's collection of pure, handcrafted soaps made from natural botanicals. Gentle on your skin, kind to the earth.",
  keywords: [
    "natural soap",
    "handmade soap",
    "artisan skincare",
    "organic soap",
    "botanical",
    "Shaant Roop",
  ],
  openGraph: {
    title: "Shaant Roop — Natural, Handcrafted Skincare",
    description:
      "Pure handcrafted soaps made from nature's finest botanicals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        {/*
          GoogleOAuthProvider must wrap the tree so useGoogleLogin / GoogleLogin
          hooks can access the client context. The Client ID is read from the
          NEXT_PUBLIC_GOOGLE_CLIENT_ID env variable (set in .env.local).
          AuthProvider wraps CartProvider so user role is available throughout.
        */}
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
        >
          <AuthProvider>
            <CartProvider>
              <NavbarWrapper />
              {children}
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
