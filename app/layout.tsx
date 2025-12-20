import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Free Indeed",
  description: "Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 1. AJOUT DE suppressHydrationWarning ICI
    <html lang="fr" suppressHydrationWarning={true}>
      {/* 2. AJOUT DE suppressHydrationWarning ICI AUSSI */}
      <body className="antialiased" suppressHydrationWarning={true}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}