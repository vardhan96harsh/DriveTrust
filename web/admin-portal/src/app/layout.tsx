import type { Metadata } from "next";
import "./globals.css";
import AdminShell from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "DriveTrust Operations | Command Center",
  description: "Aapki Gaadi, Aapka Chauffeur • Enterprise command portal for verified on-demand chauffeur dispatch, fleet insurance, and telematics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-slate-900 selection:text-white">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
