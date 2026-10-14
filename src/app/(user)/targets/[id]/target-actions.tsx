"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      setError("Masukkan nominal yang valid.");
      return;
    }
    if (type === "WITHDRAWAL" && num > saldo) {
      setError("Nominal melebihi saldo.");
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
      setError(data.error ?? "Gagal mengajukan.");
    } else {
      setMode("idle");
      setAmount("");
      router.refresh();
    }
  }

  if (mode === "idle") {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => setMode("deposit")}
          className="flex-1 rounded-lg bg-emerald-600 text-white py-2.5 text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          + Ajukan Setoran
        </button>
        <button
          onClick={() => {
            if (!canWithdraw) {
              setError("Belum memasuki tanggal pembukaan saldo.");
              return;
            }
            if (hasPendingWithdrawal) {
              setError("Masih ada penarikan yang menunggu persetujuan.");
              return;
            }
            setMode("withdraw");
          }}
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Ajukan Penarikan
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      <p className="text-sm font-medium mb-3">
        {mode === "deposit" ? "Ajukan Setoran" : "Ajukan Penarikan"}
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nominal (Rp)"
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          onClick={() =>
            submit(mode === "deposit" ? "DEPOSIT" : "WITHDRAWAL")
          }
          disabled={loading}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 transition-colors ${
            mode === "deposit"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "..." : "Kirim"}
        </button>
        <button
          onClick={() => {
            setMode("idle");
            setError("");
            setAmount("");
          }}
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Batal
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
