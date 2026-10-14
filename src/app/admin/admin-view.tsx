"use client";

import { useState } from "react";
import AdminActions from "./admin-actions";
import CreateUserModal from "./create-user-modal";
import SignOutButton from "../(user)/profile/sign-out-button";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

type PendingTx = {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  createdAt: string;
  target: {
    name: string;
    user: {
      name: string;
      email: string;
    };
  };
};

type UserData = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  targetsCount: number;
  totalSaldo: number;
};

type GlobalTx = {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  target: {
    name: string;
    user: {
      name: string;
      email: string;
    };
  };
};

type AdminViewProps = {
  adminEmail: string;
  totalDanaKelolaan: number;
  users: UserData[];
  pending: PendingTx[];
  allTransactions: GlobalTx[];
};

export default function AdminView({
  adminEmail,
  totalDanaKelolaan,
  users,
  pending,
  allTransactions,
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "verification" | "users" | "history"
  >("overview");
  const [historyFilter, setHistoryFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");

  const filteredHistory = allTransactions.filter((tx) => {
    if (historyFilter === "ALL") return true;
    return tx.status === historyFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGASI KIRI */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200/80 md:min-h-screen flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Brand Admin */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                TS
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm tracking-tight block">
                  TabungSans
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Navigasi Sub Menu */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Ikhtisar</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("verification")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "verification"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Verifikasi Transaksi</span>
              </div>
              {pending.length > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === "verification"
                      ? "bg-white text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {pending.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Data Penabung</span>
              </div>
              <span
                className={`text-[10px] font-bold ${
                  activeTab === "users" ? "text-white" : "text-slate-400"
                }`}
              >
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Riwayat Global</span>
              </div>
              <span
                className={`text-[10px] font-bold ${
                  activeTab === "history" ? "text-white" : "text-slate-400"
                }`}
              >
                {allTransactions.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Profil Admin & Tombol Keluar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Login sebagai</p>
            <p className="text-xs font-bold text-slate-800 truncate">{adminEmail}</p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* KONTEN UTAMA BERDASARKAN SUB MENU */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl">
        {/* SUB MENU 1: IKHTISAR */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Ikhtisar Sistem
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Ringkasan performa dan metrik operasional TabungSans
              </p>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Dana Kelolaan
                </p>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 tabular-nums">
                  {formatRupiah(totalDanaKelolaan)}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">
                  Saldo riil tersimpan di sistem
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Penabung
                </p>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 tabular-nums">
                  {users.length} Nasabah
                </p>
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-[11px] text-emerald-600 hover:underline font-medium mt-1 block"
                >
                  Kelola nasabah →
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Antrean Verifikasi
                </p>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 tabular-nums">
                  {pending.length} Permohonan
                </p>
                <button
                  onClick={() => setActiveTab("verification")}
                  className="text-[11px] text-amber-600 hover:underline font-medium mt-1 block"
                >
                  Buka permohonan →
                </button>
              </div>
            </div>

            {/* Antrean Pending Ringkas */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Perlu Verifikasi Segera ({pending.length})
                </h2>
                {pending.length > 0 && (
                  <button
                    onClick={() => setActiveTab("verification")}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Lihat Semua
                  </button>
                )}
              </div>

              {pending.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 text-center text-xs text-slate-400 shadow-sm">
                  ✓ Semua permohonan transaksi sudah selesai diverifikasi.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pending.slice(0, 3).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              tx.type === "DEPOSIT"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {tx.type === "DEPOSIT" ? "Setoran" : "Penarikan"}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">
                            {tx.target.user.name}
                          </span>
                          <span className="text-slate-400 text-xs">• {tx.target.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{tx.createdAt}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`font-bold text-sm tabular-nums ${
                            tx.type === "DEPOSIT" ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {tx.type === "DEPOSIT" ? "+" : "-"}
                          {formatRupiah(tx.amount)}
                        </span>
                        <div className="w-36">
                          <AdminActions txId={tx.id} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB MENU 2: VERIFIKASI TRANSAKSI */}
        {activeTab === "verification" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Verifikasi Transaksi
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Setujui atau tolak pengajuan setoran dan penarikan nasabah
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {pending.length} Menunggu Tindakan
              </span>
            </div>

            {pending.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200/80 text-center space-y-2 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Tidak ada transaksi tertunda
                </p>
                <p className="text-xs text-slate-400">
                  Semua permohonan setoran dan penarikan telah diproses.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              tx.type === "DEPOSIT"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {tx.type === "DEPOSIT" ? "Setoran Simulasi" : "Penarikan Simulasi"}
                          </span>
                          <span className="text-xs text-slate-400">
                            Target: <strong className="text-slate-700">{tx.target.name}</strong>
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {tx.target.user.name} ({tx.target.user.email})
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Diajukan: {tx.createdAt}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span
                          className={`text-xl font-extrabold tabular-nums block ${
                            tx.type === "DEPOSIT" ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {tx.type === "DEPOSIT" ? "+" : "-"}
                          {formatRupiah(tx.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 max-w-xs">
                      <AdminActions txId={tx.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUB MENU 3: DATA PENABUNG */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Data Penabung
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daftar akun nasabah yang dibuat dan diawasi oleh Admin
                </p>
              </div>
              <CreateUserModal />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {users.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada penabung. Klik "+ Buat Akun Penabung" untuk menambahkan akun.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Nama Penabung</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Target Aktif</th>
                        <th className="py-3 px-4 text-right">Saldo Tersimpan</th>
                        <th className="py-3 px-4 text-right">Terdaftar Sejak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {u.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">{u.email}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {u.targetsCount} Target
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                            {formatRupiah(u.totalSaldo)}
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-400">
                            {u.createdAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUB MENU 4: RIWAYAT GLOBAL */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Riwayat Global
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audit seluruh mutasi setoran dan penarikan di sistem
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setHistoryFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    historyFilter === "ALL"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setHistoryFilter("APPROVED")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    historyFilter === "APPROVED"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Disetujui
                </button>
                <button
                  onClick={() => setHistoryFilter("PENDING")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    historyFilter === "PENDING"
                      ? "bg-white text-amber-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Menunggu
                </button>
                <button
                  onClick={() => setHistoryFilter("REJECTED")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    historyFilter === "REJECTED"
                      ? "bg-white text-red-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Ditolak
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {filteredHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Tidak ada catatan transaksi dengan filter ini.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Penabung</th>
                        <th className="py-3 px-4">Target Tabungan</th>
                        <th className="py-3 px-4">Jenis Transaksi</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Nominal</th>
                        <th className="py-3 px-4 text-right">Tanggal Waktu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHistory.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {tx.target.user.name}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {tx.target.user.email}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {tx.target.name}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                tx.type === "DEPOSIT"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {tx.type === "DEPOSIT" ? "Setoran" : "Penarikan"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                tx.status === "APPROVED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : tx.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {tx.status === "APPROVED"
                                ? "Disetujui"
                                : tx.status === "REJECTED"
                                ? "Ditolak"
                                : "Menunggu"}
                            </span>
                          </td>
                          <td
                            className={`py-3.5 px-4 text-right font-bold tabular-nums ${
                              tx.type === "DEPOSIT" ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {tx.type === "DEPOSIT" ? "+" : "-"}
                            {formatRupiah(tx.amount)}
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-400">
                            {tx.createdAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
