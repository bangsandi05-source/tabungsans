"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Gagal mengubah kata sandi.");
    } else {
      setSuccess("Kata sandi berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
      }, 1500);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all text-center"
      >
        🔒 Ubah Kata Sandi Akun
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-2">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Ubah Kata Sandi
        </h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError("");
            setSuccess("");
          }}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          Batal
        </button>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
          Kata Sandi Saat Ini
        </label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
          Kata Sandi Baru (Min. 6 Karakter)
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
          Ulangi Kata Sandi Baru
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15"
        />
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-60 transition-all"
      >
        {loading ? "Menyimpan..." : "Simpan Kata Sandi"}
      </button>
    </form>
  );
}
