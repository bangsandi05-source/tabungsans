"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Gagal mendaftar.");
    } else {
      router.push("/login?registered=1");
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Daftar Akun TabungSans</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Nama lengkap"
            required
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min. 8 karakter)"
            required
            minLength={8}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-zinc-900 text-white py-2.5 text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500 mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-zinc-900 font-medium dark:text-zinc-100">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}
