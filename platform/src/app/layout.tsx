import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Standard SaaS — Websites for Home-Service Businesses",
  description:
    "A complete website + admin platform for home-service businesses. Launch your site, customize your theme, and manage leads and appointments.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning style={{ scrollbarWidth: "none" }}>
      <head>
        {/* Set theme before paint to avoid a flash. Marketing site defaults to dark. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `html,body,*,*::before,*::after{-ms-overflow-style:none!important;scrollbar-width:none!important}::-webkit-scrollbar,::-webkit-scrollbar-button,::-webkit-scrollbar-thumb,::-webkit-scrollbar-track,::-webkit-scrollbar-corner{width:0!important;height:0!important;display:none!important;background:transparent!important}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ scrollbarWidth: "none" }}>{children}</body>
    </html>
  );
}
