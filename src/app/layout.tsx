import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TabungSans — Platform Simulasi Tabungan Terpercaya",
  description:
    "Aplikasi simulasi tabungan berjangka. Semua transaksi bersifat simulasi tanpa uang sungguhan.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fontSans.className} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {/* Banner Simulasi yang Tenang dan Profesional */}
        <header className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 shadow-sm border-b border-emerald-950/20">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500 text-white tracking-wide uppercase">
                Mode Simulasi
              </span>
              <span className="text-slate-200">
                Semua data tabungan adalah latihan simulasi (tanpa uang riil).
              </span>
            </div>
            <span className="hidden sm:inline text-emerald-300 text-[11px]">TabungSans v1.0</span>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
