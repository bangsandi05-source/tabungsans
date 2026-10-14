import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default async function HistoryPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const transactions = await prisma.transaction.findMany({
    where: { target: { userId } },
    include: { target: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="px-5 pt-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Riwayat Aktivitas
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Catatan mutasi setoran dan penarikan simulasi Anda
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            Belum ada catatan transaksi
          </p>
          <p className="text-xs text-slate-400">
            Transaksi yang Anda ajukan akan tercatat rapi di sini
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    tx.type === "DEPOSIT"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}
                >
                  {tx.type === "DEPOSIT" ? "+" : "-"}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 text-sm">
                    {tx.type === "DEPOSIT" ? "Setoran" : "Penarikan"} • {tx.target.name}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {tx.createdAt.toLocaleDateString("id-ID")} •{" "}
                    <span
                      className={`font-semibold ${
                        tx.status === "APPROVED"
                          ? "text-emerald-600"
                          : tx.status === "REJECTED"
                          ? "text-red-500"
                          : "text-amber-600"
                      }`}
                    >
                      {tx.status === "APPROVED"
                        ? "Disetujui"
                        : tx.status === "REJECTED"
                        ? "Ditolak"
                        : "Menunggu Approval"}
                    </span>
                  </p>
                </div>
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
    </main>
  );
}
