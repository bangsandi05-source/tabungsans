"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTargetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const targetAmountRaw = form.get("targetAmount") as string;

    const res = await fetch("/api/targets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        targetAmount: targetAmountRaw ? Number(targetAmountRaw) : null,
        targetDate: form.get("targetDate"),
        withdrawalOpenDate: form.get("withdrawalOpenDate"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Gagal membuat target baru.");
    } else {
      router.push("/targets");
      router.refresh();
    }
  }

  return (
    <main className="px-5 pt-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/targets"
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-sm shadow-sm"
        >
          ←
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Target Baru
          </h1>
          <p className="text-xs text-slate-400">Tentukan rencana finansial Anda</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Nama Rencana Target
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Contoh: Beli Laptop Baru, Dana Darurat"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Nominal Target (Rp)
              </label>
              <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded">
                Boleh Kosong
              </span>
            </div>
            <input
              name="targetAmount"
              type="number"
              min={0}
              placeholder="Contoh: 5000000 (opsional)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Kosongkan jika target tabungan ini bersifat fleksibel tanpa batasan angka tertentu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Tanggal Target Tercapai
              </label>
              <input
                name="targetDate"
                type="date"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Boleh Tarik Mulai Dari
              </label>
              <input
                name="withdrawalOpenDate"
                type="date"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/25"
            >
              {loading ? "Menyimpan Data..." : "Simpan Target Tabungan"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
