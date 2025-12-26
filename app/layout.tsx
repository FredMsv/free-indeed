import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";

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
    // suppressHydrationWarning doit être sur <html>
    <html lang="fr" suppressHydrationWarning>
      {/* AJOUTEZ suppressHydrationWarning sur <body> également 
         C'est souvent là que les extensions (LastPass, Grammarly, etc.) injectent des attributs
      */}
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}