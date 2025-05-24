import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoCommitter Pro - GitHub Automation Platform",
  description:
    "Revolutionary GitHub automation with AI-powered features, daily commit scheduling, and intelligent optimization",
  icons: {
    icon: "https://i.postimg.cc/FR3xvZ4t/social.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} uniques-theme`}>
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
