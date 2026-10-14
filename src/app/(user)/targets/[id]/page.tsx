import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import TargetActions from "./target-actions";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default async function TargetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id!;

  const target = await prisma.target.findUnique({
    where: { id, userId },
    include: {
      transactions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!target) notFound();

  const saldo = target.transactions
    .filter((tx) => tx.status === "APPROVED")
    .reduce((s, tx) => s + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount), 0);

  const persen =
    target.targetAmount != null && target.targetAmount > 0
      ? Math.min(Math.round((saldo / target.targetAmount) * 100), 100)
      : null;

  const now = new Date();
  const canWithdraw = now >= target.withdrawalOpenDate;
  const hasPendingWithdrawal = target.transactions.some(
    (tx) => tx.type === "WITHDRAWAL" && tx.status === "PENDING"
  );

  return (
    <main className="px-5 pt-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/targets"
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-sm shadow-sm"
        >
          ←
        </Link>
        <div>
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
            Detail Target
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {target.name}
          </h1>
        </div>
      </div>

      {/* FinTech Card Saldo Pos Ini */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-xl shadow-slate-900/10">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-300 mb-1">
          Saldo Terkumpul di Pos Ini
        </div>
        <div className="text-3xl font-extrabold tracking-tight tabular-nums">
          {formatRupiah(saldo)}
        </div>

        {persen != null ? (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${persen}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-300">
              <span>{persen}% dari {formatRupiah(target.targetAmount!)}</span>
              <span>Sisa: {formatRupiah(Math.max(target.targetAmount! - saldo, 0))}</span>
            </div>
          </div>
        ) : (
          <p className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400">
            Target nominal fleksibel tanpa batas akhir nominal.
          </p>
        )}
      </div>

      {/* Info Aturan Tarik & Jatuh Tempo */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-slate-400 font-medium">Jatuh Tempo</p>
          <p className="font-bold text-slate-800 mt-0.5">
            {target.targetDate.toLocaleDateString("id-ID")}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-slate-400 font-medium">Izin Penarikan</p>
          <p
            className={`font-bold mt-0.5 ${
              canWithdraw ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {target.withdrawalOpenDate.toLocaleDateString("id-ID")}
          </p>
        </div>
      </div>

      {/* Aksi Setor & Tarik */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <TargetActions
          targetId={target.id}
          canWithdraw={canWithdraw}
          hasPendingWithdrawal={hasPendingWithdrawal}
          saldo={saldo}
        />
      </div>

      {/* Riwayat Mutasi Pos Ini */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Mutasi Transaksi Pos Ini
        </h2>

        {target.transactions.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 text-center text-xs text-slate-400 shadow-sm">
            Belum ada permohonan transaksi untuk target ini.
          </div>
        ) : (
          <div className="space-y-2">
            {target.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tx.type === "DEPOSIT" ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    <span className="font-semibold text-slate-900 text-xs">
                      {tx.type === "DEPOSIT" ? "Setoran Simulasi" : "Penarikan Simulasi"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {tx.createdAt.toLocaleDateString("id-ID")} •{" "}
                    <span
                      className={
                        tx.status === "APPROVED"
                          ? "text-emerald-600 font-medium"
                          : tx.status === "REJECTED"
                          ? "text-red-500 font-medium"
                          : "text-amber-600 font-medium"
                      }
                    >
                      {tx.status === "APPROVED"
                        ? "Disetujui Admin"
                        : tx.status === "REJECTED"
                        ? "Ditolak Admin"
                        : "Menunggu Verifikasi Admin"}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold text-sm tabular-nums ${
                      tx.type === "DEPOSIT" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "DEPOSIT" ? "+" : "-"}
                    {formatRupiah(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
