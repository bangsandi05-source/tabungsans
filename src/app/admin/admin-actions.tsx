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
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => handle("APPROVED")}
        disabled={loading}
        className="rounded-lg bg-emerald-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        Setujui
      </button>
      <button
        onClick={() => handle("REJECTED")}
        disabled={loading}
        className="rounded-lg border border-red-300 text-red-600 px-4 py-1.5 text-sm font-medium hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 disabled:opacity-50 transition-colors"
      >
        Tolak
      </button>
    </div>
  );
}
