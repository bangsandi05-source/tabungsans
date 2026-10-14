import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default async function TargetsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const targets = await prisma.target.findMany({
    where: { userId },
    include: {
      transactions: { where: { status: "APPROVED" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="px-5 pt-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Target Tabungan
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar seluruh tujuan tabungan simulasi Anda
          </p>
        </div>
        <Link
          href="/targets/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95"
        >
          <span>+</span> Buat Target
        </Link>
      </div>

      {targets.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
            🎯
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Belum ada target tabungan
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Rencanakan impian Anda dengan target baru
            </p>
          </div>
          <Link
            href="/targets/new"
            className="inline-block px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Mulai Buat Target
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {targets.map((t) => {
            const saldo = t.transactions.reduce(
              (s, tx) => s + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount),
              0
            );
            const persen =
              t.targetAmount != null && t.targetAmount > 0
                ? Math.min(Math.round((saldo / t.targetAmount) * 100), 100)
                : null;

            return (
              <Link
                key={t.id}
                href={`/targets/${t.id}`}
                className="block p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm">
                      {t.name}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Buka tabungan: {t.withdrawalOpenDate.toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 text-sm tabular-nums">
                      {formatRupiah(saldo)}
                    </span>
                    {t.targetAmount != null && (
                      <p className="text-[11px] text-slate-400">
                        / {formatRupiah(t.targetAmount)}
                      </p>
                    )}
                  </div>
                </div>

                {persen != null ? (
                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>Progres {persen}%</span>
                      <span>Boleh ditarik: {t.withdrawalOpenDate.toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                    <span>Target fleksibel</span>
                    <span>Boleh ditarik: {t.withdrawalOpenDate.toLocaleDateString("id-ID")}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
