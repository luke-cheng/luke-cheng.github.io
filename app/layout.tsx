import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./site.css";
import SiteFrame from "./_components/SiteFrame";

export const metadata: Metadata = {
  title: "Luke Cheng",
  description: "Explore Luke Cheng's work, interests, and thoughts.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
