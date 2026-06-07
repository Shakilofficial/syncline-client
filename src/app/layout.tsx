import type { Metadata } from "next";
import { Syne, Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-serif-display",
  display: "swap",
});

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-google-sans-flex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Syncline - Task Management & Collaboration",
  description: "Collaborative project and task tracking dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${googleSansFlex.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

