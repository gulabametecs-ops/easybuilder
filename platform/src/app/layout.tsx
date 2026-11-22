import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SitePixl — Websites for Home-Service Businesses",
  description:
    "A complete website + admin platform for home-service businesses. Launch your site, customize your theme, and manage leads and appointments.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning style={{ scrollbarWidth: "none" }}>
      <body className="min-h-full flex flex-col" style={{ scrollbarWidth: "none" }}>
        {children}
      </body>
    </html>
  );
}
