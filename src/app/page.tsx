import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    const role = (session.user as unknown as { role?: string })?.role;
    if (role === "ADMIN") redirect("/admin");
    redirect("/dashboard");
  }

  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white text-2xl font-bold shadow-lg shadow-emerald-600/20 mx-auto mb-2">
          TS
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Tabung<span className="text-emerald-600">Sans</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Platform perencanaan target tabungan berjangka. Belajar disiplin
            finansial dengan simulasi aman dan terstruktur.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="text-left text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-normal">
            💡 <strong className="text-slate-700">Akses Eksklusif:</strong> Akun penabung dibuat dan dikelola langsung oleh administrator sistem.
          </div>

          <Link
            href="/login"
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/25"
          >
            Masuk ke Akun
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          Belum punya akun? Hubungi Admin untuk pembuatan rekening simulasi Anda.
        </p>
      </div>
    </main>
  );
}
