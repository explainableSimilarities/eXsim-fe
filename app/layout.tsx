import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";

const poppins = Titillium_Web({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "neXSim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
