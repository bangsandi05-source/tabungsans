import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#047857",
};

export const metadata: Metadata = {
  title: "TabungSans — Platform Simulasi Tabungan Terpercaya",
  description:
    "Aplikasi simulasi tabungan berjangka. Semua transaksi bersifat simulasi tanpa uang sungguhan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TabungSans",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fontSans.className} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {/* Banner Motivasi & Branding Profesional */}
        <header className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 shadow-sm border-b border-emerald-950/20">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white tracking-wider uppercase shrink-0 shadow-sm">
                Crafted by Sandi
              </span>
              <span className="text-slate-200 text-[11px] truncate">
                Sedikit demi sedikit, lama-lama menjadi bukit. Wujudkan impianmu hari ini.
              </span>
            </div>
            <span className="hidden sm:inline text-emerald-300/80 text-[11px] font-medium shrink-0">
              TabungSans v1.0
            </span>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
