import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

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
    <html lang="fr" suppressHydrationWarning={true}>
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
        {/* ✅ AJOUT DU TOASTER SONNER */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}