import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import Navbar from "@/components/Navbar";

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
        className={`h-full ${inter.variable} ${calFont.variable} font-sans antialiased`}
      >
        <ClientWrapper>
          <Navbar />
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
