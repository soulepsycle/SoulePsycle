import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: "SoulePsycle Commerce",
  description: "[soul•cycle]shouting your sighs. All our designs are copyright of our store. DO NOT REPRINT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
