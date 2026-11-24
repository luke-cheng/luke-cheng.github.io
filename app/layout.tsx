import { GoogleAnalytics } from '@next/third-parties/google';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("luke-theme");var d=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",d);}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`,
          }}
        />
      </head>
      <body>
        <SiteFrame>{children}</SiteFrame>
      </body>
      <GoogleAnalytics gaId="G-27TDBYW7WW" />
    </html>
  );
}
