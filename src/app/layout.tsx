import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Suraj Electric & Solar — Maharashtra's Premier Rooftop Solar EPC | Suraj Ghode",
  description:
    "Suraj Electric & Solar, founded by Suraj Ghode. Certified PM Surya Ghar rooftop solar pergola installation, net metering, 0-investment solar, and ₹78,000 central subsidy in Pune and Maharashtra.",
  keywords: "Suraj Electric and Solar, Suraj Ghode, solar pergola, PM Surya Ghar, rooftop solar Pune, solar panels Maharashtra",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
