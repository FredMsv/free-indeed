import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Indeed - Liberté en Christ",
  description: "Application chrétienne de soutien contre les addictions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}