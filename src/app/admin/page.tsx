import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminActions from "./admin-actions";
import CreateUserModal from "./create-user-modal";
import SignOutButton from "../(user)/profile/sign-out-button";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as unknown as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/dashboard");

  // Transaksi Pending
  const pending = await prisma.transaction.findMany({
    where: { status: "PENDING" },
    include: {
      target: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Semua Penabung + Target + Transaksi Approved untuk kalkulasi saldo
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      targets: {
        include: {
          transactions: { where: { status: "APPROVED" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Total dana simulasi kelolaan
  const totalDanaKelolaan = users.reduce((sumUser, u) => {
    const userSaldo = u.targets.reduce((sumTarget, t) => {
      const saldoTarget = t.transactions.reduce(
        (s, tx) => s + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount),
        0
      );
      return sumTarget + saldoTarget;
    }, 0);
    return sumUser + userSaldo;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Navbar Admin */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              TS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  Panel Administrator
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{session.user?.email}</p>
            </div>
          </div>
          <div className="w-28">
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {/* Ringkasan Statistik Finansial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Dana Simulasi Kelolaan
            </p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 tabular-nums">
              {formatRupiah(totalDanaKelolaan)}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              Dari seluruh rekening penabung
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Penabung Terdaftar
            </p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 tabular-nums">
              {users.length} Akun
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Dibuat secara terpusat oleh Admin
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Antrean Verifikasi Transaksi
            </p>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 tabular-nums">
              {pending.length} Permohonan
            </p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">
              {pending.length > 0 ? "Memerlukan tindakan segera" : "Semua beres"}
            </p>
          </div>
        </div>

        {/* SECTION 1: ANTRIAN VERIFIKASI TRANSAKSI */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Antrean Verifikasi Transaksi
              </h2>
              <p className="text-xs text-slate-400">
                Persetujuan setoran atau penarikan simulasi dari penabung
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {pending.length} Menunggu
            </span>
          </div>

          {pending.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center text-xs text-slate-400 shadow-sm">
              ✨ Tidak ada permohonan transaksi yang sedang menunggu persetujuan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pending.map((tx) => (
                <div
                  key={tx.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            tx.type === "DEPOSIT"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {tx.type === "DEPOSIT" ? "Setoran Masuk" : "Penarikan Dana"}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {tx.target.name}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                        {tx.target.user.name}
                      </h3>
                      <p className="text-xs text-slate-400">{tx.target.user.email}</p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-lg font-extrabold tabular-nums ${
                          tx.type === "DEPOSIT" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {tx.type === "DEPOSIT" ? "+" : "-"}
                        {formatRupiah(tx.amount)}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {tx.createdAt.toLocaleDateString("id-ID")}{" "}
                        {tx.createdAt.toLocaleTimeString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <AdminActions txId={tx.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: KELOLA PENABUNG */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Daftar Rekening Penabung
              </h2>
              <p className="text-xs text-slate-400">
                Semua akun penabung yang telah dibuat dan diawasi oleh Admin
              </p>
            </div>
            <CreateUserModal />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {users.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Belum ada akun penabung. Klik tombol "+ Buat Akun Penabung" di atas untuk mendaftarkan akun pertama.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Nama Penabung</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Target Aktif</th>
                      <th className="py-3 px-4 text-right">Total Saldo Simulasi</th>
                      <th className="py-3 px-4 text-right">Terdaftar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => {
                      const totalSaldoUser = u.targets.reduce((sumT, t) => {
                        const s = t.transactions.reduce(
                          (acc, tx) => acc + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount),
                          0
                        );
                        return sumT + s;
                      }, 0);

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {u.name}
                          </td>
                          <td className="py-3 px-4 text-slate-500">{u.email}</td>
                          <td className="py-3 px-4 text-slate-600">
                            {u.targets.length} Target
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                            {formatRupiah(totalSaldoUser)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400">
                            {u.createdAt.toLocaleDateString("id-ID")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
