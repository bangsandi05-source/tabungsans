"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminActions({ txId }: { txId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handle(action: "APPROVED" | "REJECTED") {
    setLoading(true);
    await fetch("/api/transactions/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txId, status: action }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle("APPROVED")}
        disabled={loading}
        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs shadow-sm shadow-emerald-600/20 transition-all disabled:opacity-60"
      >
        {loading ? "..." : "✓ Setujui"}
      </button>
      <button
        onClick={() => handle("REJECTED")}
        disabled={loading}
        className="flex-1 py-2 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 font-semibold text-xs transition-all disabled:opacity-60"
      >
        {loading ? "..." : "✕ Tolak"}
      </button>
    </div>
  );
}
