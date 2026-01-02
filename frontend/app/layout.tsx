import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeSync - Trading Dashboard",
  description: "Connect multiple prop firm accounts into a single interface with unified analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
