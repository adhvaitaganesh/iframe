import "./globals.css";
import { Inter } from "next/font/google";
import { AppProps } from "next/app";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TBA iframe",
  description: "View your nft's TBA and it's nfts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
