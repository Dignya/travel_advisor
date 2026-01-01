import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProvider from "@/components/SessionProvider";
import { ToastProvider } from "@/components/ui/toast-system";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Travel Advisor",
  description: "AI-powered travel planning with personalized destination recommendations",
  keywords: ["travel", "AI", "planning", "destinations", "MongoDB", "Next.js"],
  authors: [{ name: "Smart Travel Advisor Team" }],
  openGraph: {
    title: "Smart Travel Advisor",
    description: "AI-powered travel planning with personalized destination recommendations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Travel Advisor",
    description: "AI-powered travel planning with personalized destination recommendations",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider />
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
