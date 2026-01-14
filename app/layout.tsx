import type { Metadata } from "next";
import { Geist, Geist_Mono, Kanit, Sarabun } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "แบบฟอร์มออนไลน์ศูนย์คอมพิวเตอร์",
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kanit.variable} ${sarabun.variable} antialiased font-sans`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64 transition-all duration-300">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
