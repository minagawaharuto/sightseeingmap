import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sightseeing Map",
  description: "観光ルート提案アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
