import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const targets = await prisma.target.findMany({
    where: { userId },
    include: {
      transactions: { where: { status: "APPROVED" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSaldo = targets.reduce((sum, t) => {
    const saldo = t.transactions.reduce(
      (s, tx) => s + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount),
      0
    );
    return sum + saldo;
  }, 0);

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "P";

  return (
    <main className="px-5 pt-6 space-y-6">
      {/* Top Bar Pengguna */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium">Rekening Penabung</p>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {session?.user?.name}
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200 shadow-sm text-sm">
          {userInitial}
        </div>
      </div>

      {/* FinTech Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 p-6 text-white shadow-xl shadow-emerald-900/15">
        <div className="absolute -right-6 -bottom-8 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-emerald-200/90 mb-1">
              Total Saldo Tersimpan
            </span>
            <div className="text-3xl font-extrabold tracking-tight tabular-nums">
              {formatRupiah(totalSaldo)}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 text-emerald-100 backdrop-blur-md border border-white/10">
            Simulasi Aktif
          </span>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100/80 relative z-10">
          <span>{targets.length} Target Berjalan</span>
          <Link
            href="/targets/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-semibold text-xs shadow-sm hover:bg-emerald-50 transition-all active:scale-95"
          >
            + Target Baru
          </Link>
        </div>
      </div>

      {/* Bagian Target Tabungan */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Target Tabungan
          </h2>
          <Link
            href="/targets"
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Lihat Semua
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
                Mulai atur pos tabungan pertama Anda sekarang
              </p>
            </div>
            <Link
              href="/targets/new"
              className="inline-block px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Buat Target Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {targets.slice(0, 3).map((t) => {
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
                      <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm">
                        {t.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Target: {t.targetDate.toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-sm tabular-nums">
                        {formatRupiah(saldo)}
                      </span>
                      {t.targetAmount != null && (
                        <p className="text-[11px] text-slate-400">
                          dari {formatRupiah(t.targetAmount)}
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
                        <span>Tercapai {persen}%</span>
                        <span>
                          Sisa {formatRupiah(Math.max(t.targetAmount! - saldo, 0))}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 italic">
                      Target nominal fleksibel (bebas nominal)
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
