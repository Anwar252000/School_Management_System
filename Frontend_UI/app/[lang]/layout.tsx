import "../assets/scss/globals.scss";
import "../assets/scss/theme.scss";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import React from "react";
import ClientLayout from "@/provider/clientLayout"; // ✅ Move client-side logic here

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

// ✅ Only server-side logic here
export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang}>
      <body>
        {/* ✅ Client-side logic now runs inside ClientLayout */}
        <ClientLayout lang={lang}>{children}</ClientLayout>
      </body>
    </html>
  );
}
