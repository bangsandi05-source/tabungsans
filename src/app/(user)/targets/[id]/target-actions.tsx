"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function TargetActions({
  targetId,
  canWithdraw,
  hasPendingWithdrawal,
  saldo,
}: {
  targetId: string;
  canWithdraw: boolean;
  hasPendingWithdrawal: boolean;
  saldo: number;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "deposit" | "withdraw">("idle");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(type: "DEPOSIT" | "WITHDRAWAL") {
    setError("");
    const num = Number(amount);
    if (!num || num <= 0) {
      setError("Masukkan nominal yang valid (lebih dari 0).");
      return;
    }
    if (type === "WITHDRAWAL" && num > saldo) {
      setError("Nominal penarikan melebihi saldo yang tersedia.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, type, amount: num }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Permohonan gagal dikirim.");
    } else {
      setMode("idle");
      setAmount("");
      router.refresh();
    }
  }

  if (mode === "idle") {
    return (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Aksi Transaksi Simulasi
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setError("");
              setMode("deposit");
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <span className="text-sm">+</span> Ajukan Setoran
          </button>
          <button
            onClick={() => {
              setError("");
              if (!canWithdraw) {
                setError(
                  "Penarikan belum diizinkan karena belum memasuki tanggal pembukaan saldo."
                );
                return;
              }
              if (hasPendingWithdrawal) {
                setError(
                  "Masih ada permohonan penarikan yang menunggu persetujuan Admin."
                );
                return;
              }
              if (saldo <= 0) {
                setError("Saldo target ini masih Rp 0.");
                return;
              }
              setMode("withdraw");
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] text-slate-700 font-semibold text-xs transition-all"
          >
            <span className="text-sm">↑</span> Ajukan Penarikan
          </button>
        </div>
        {error && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {mode === "deposit"
            ? "Permohonan Setoran Simulasi"
            : "Permohonan Penarikan Simulasi"}
        </p>
        <button
          onClick={() => {
            setMode("idle");
            setError("");
            setAmount("");
          }}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          Batal
        </button>
      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-400">
        <span>
          {mode === "deposit"
            ? "Saldo akan bertambah setelah diverifikasi Admin."
            : "Saldo akan berkurang setelah disetujui Admin."}
        </span>
        {mode === "withdraw" && saldo > 0 && (
          <button
            type="button"
            onClick={() => setAmount(String(saldo))}
            className="font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 transition-colors"
          >
            Tarik Semua ({formatRupiah(saldo)})
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-slate-400">
            Rp
          </span>
          <input
            type="number"
            min={1}
            max={mode === "withdraw" ? saldo : undefined}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Nominal"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all"
          />
        </div>
        <button
          onClick={() =>
            submit(mode === "deposit" ? "DEPOSIT" : "WITHDRAWAL")
          }
          disabled={loading}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs text-white shadow-sm transition-all active:scale-95 disabled:opacity-60 ${
            mode === "deposit"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Mengirim..." : "Kirim Pengajuan"}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
          {error}
        </div>
      )}
    </div>
  );
}
