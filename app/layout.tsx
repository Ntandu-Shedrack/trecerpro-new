import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TracerPro | Enterprise Asset Management",
  description: "Modern enterprise asset management and verification platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light dark">
      <body
        className={`
          ${inter.variable}
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
