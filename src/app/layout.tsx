import type { Metadata } from "next";
import { red_rose } from "./fonts";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Header from "./components/common/Header/Header";


export const metadata: Metadata = {
  title: "Pokedex",
  description: "A simple Pokedex app built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={red_rose.className}>
      <NextTopLoader />
      <Header />
        {children}
        </body>
    </html>
  );
}
