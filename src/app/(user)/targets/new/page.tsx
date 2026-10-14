"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      setError(data.error ?? "Gagal membuat target.");
    } else {
      router.push("/targets");
      router.refresh();
    }
  }

  return (
    <main className="max-w-md mx-auto w-full px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Buat Target Baru</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama target</label>
          <input
            name="name"
            type="text"
            required
            placeholder="Contoh: Dana Darurat"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Nominal target (opsional)
          </label>
          <input
            name="targetAmount"
            type="number"
            min={0}
            placeholder="Kosongkan jika belum tahu"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <p className="text-xs text-zinc-400 mt-1">
            Jika kosong, progres persentase tidak ditampilkan.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal target tercapai</label>
          <input
            name="targetDate"
            type="date"
            required
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tanggal mulai boleh tarik saldo
          </label>
          <input
            name="withdrawalOpenDate"
            type="date"
            required
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 text-white py-2.5 text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
        >
          {loading ? "Menyimpan..." : "Buat Target"}
        </button>
      </form>
    </main>
  );
}
