import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TabungSans — Simulasi Tabungan",
  description:
    "Aplikasi simulasi tabungan berjangka. Semua transaksi bersifat simulasi dan tidak melibatkan uang sungguhan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {/* Disclaimer simulasi — selalu tampil */}
        <div className="bg-amber-100 text-amber-900 text-center text-sm py-1.5 px-4 dark:bg-amber-900/30 dark:text-amber-200">
          ⚠ Semua transaksi di TabungSans bersifat <strong>simulasi</strong>.
          Tidak ada uang sungguhan yang disimpan atau dipindahkan.
        </div>
        {children}
      </body>
    </html>
  );
}
