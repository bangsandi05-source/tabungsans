"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

type UserTarget = {
  id: string;
  name: string;
  targetAmount: number | null;
  withdrawalOpenDate: string;
  saldo: number;
};

export type UserDetail = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  targetsCount: number;
  totalSaldo: number;
  targets: UserTarget[];
};

export default function UserDetailModal({
  user,
  onClose,
}: {
  user: UserDetail;
  onClose: () => void;
}) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, newPassword }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Gagal mereset kata sandi.");
    } else {
      setSuccess("Kata sandi nasabah berhasil di-reset!");
      setNewPassword("");
      setTimeout(() => setSuccess(""), 3000);
      router.refresh();
    }
  }

  async function handleDeleteUser() {
    setError("");
    setDeleting(true);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "DELETE",
    });

    setDeleting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Gagal menghapus penabung.");
      setShowDeleteConfirm(false);
    } else {
      onClose();
      router.refresh();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg border border-emerald-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-400">{user.email}</p>
              <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                Terdaftar: {user.createdAt}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Ringkasan Saldo Finansial Nasabah */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              Total Saldo Seluruh Pos Tabungan
            </p>
            <p className="text-2xl font-extrabold tracking-tight tabular-nums mt-0.5">
              {formatRupiah(user.totalSaldo)}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-emerald-200 border border-white/10">
            {user.targetsCount} Target Aktif
          </span>
        </div>

        {/* Daftar Target Tabungan Nasabah */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Rincian Pos Tabungan Nasabah
          </h4>

          {user.targets.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
              Nasabah ini belum membuat pos target tabungan.
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {user.targets.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-[10px] text-slate-400">
                      Buka tabungan: {t.withdrawalOpenDate}
                      {t.targetAmount && ` • Target: ${formatRupiah(t.targetAmount)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatRupiah(t.saldo)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bagian Bantuan Lupa Password / Reset Password oleh Admin */}
        <div className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/40 space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-sm">🔑</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Bantuan Kata Sandi (Lupa Password)
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                Password tersimpan aman (terenkripsi). Jika penabung lupa kata sandi, buatkan kata sandi baru di bawah ini.
              </p>
            </div>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-2 pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Kata sandi baru (min. 6 karakter)"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all disabled:opacity-60 shadow-sm"
              >
                {loading ? "Menyimpan..." : "Reset Kata Sandi"}
              </button>
            </div>

            {error && (
              <p className="text-[11px] text-red-600 font-medium">{error}</p>
            )}
            {success && (
              <p className="text-[11px] text-emerald-700 font-semibold">{success}</p>
            )}
          </form>
        </div>

        {/* Zona Bahaya: Hapus Akun Penabung */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-700">Hapus Akun Penabung</p>
            <p className="text-[10px] text-slate-400">
              {user.totalSaldo === 0
                ? "Saldo Rp 0. Akun siap dibersihkan dari sistem."
                : "Hanya bisa dihapus jika total saldo Rp 0."}
            </p>
          </div>

          {user.totalSaldo === 0 && (
            <div>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-all"
                >
                  Hapus Akun
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-red-600 font-semibold">Yakin hapus?</span>
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    disabled={deleting}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {deleting ? "Menghapus..." : "Ya, Hapus Permanen"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
