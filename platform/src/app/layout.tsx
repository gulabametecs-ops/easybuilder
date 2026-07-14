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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid a flash. Marketing site defaults to dark. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
