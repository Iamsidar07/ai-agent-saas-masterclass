import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
  display: "swap",
});
const calFont = localFont({
  src: "./fonts/CalSans-SemiBold.woff2",
  variable: "--font-cal",
  preload: true,
  display: "swap",
});
export const metadata: Metadata = {
  title: "AgentTube",
  description: "Your personal content ai agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`h-full ${inter.variable} ${calFont.variable} font-inter antialiased`}
      >
        <ClientWrapper>
          <Navbar />
          {children}
          <Toaster
            closeButton
            expand
            position="bottom-right"
            richColors
          />
          <NextTopLoader
            color="#FF0000"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            // crawl={true}
            easing="ease"
            speed={200}
            showSpinner={false}
          />
        </ClientWrapper>
      </body>
    </html>
  );
}
