import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminView from "./admin-view";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as unknown as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/dashboard");

  // Antrean Transaksi Pending
  const pendingRaw = await prisma.transaction.findMany({
    where: { status: "PENDING" },
    include: {
      target: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Semua Pengguna (Role USER murni) beserta detail target & saldo masing-masing
  const usersRaw = await prisma.user.findMany({
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

  // Seluruh Transaksi untuk Riwayat Global
  const allTxRaw = await prisma.transaction.findMany({
    include: {
      target: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Kalkulasi data bersih dan terstruktur untuk Client Component
  const users = usersRaw.map((u) => {
    const targets = u.targets.map((t) => {
      const saldoTarget = t.transactions.reduce(
        (s, tx) => s + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount),
        0
      );
      return {
        id: t.id,
        name: t.name,
        targetAmount: t.targetAmount,
        withdrawalOpenDate: t.withdrawalOpenDate.toLocaleDateString("id-ID"),
        saldo: saldoTarget,
      };
    });

    const totalSaldo = targets.reduce((sum, t) => sum + t.saldo, 0);

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt.toLocaleDateString("id-ID"),
      targetsCount: targets.length,
      totalSaldo,
      targets,
    };
  });

  const totalDanaKelolaan = users.reduce((sum, u) => sum + u.totalSaldo, 0);

  const pending = pendingRaw.map((tx) => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    createdAt: `${tx.createdAt.toLocaleDateString("id-ID")} ${tx.createdAt.toLocaleTimeString("id-ID")}`,
    target: {
      name: tx.target.name,
      user: {
        name: tx.target.user.name,
        email: tx.target.user.email,
      },
    },
  }));

  const allTransactions = allTxRaw.map((tx) => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    status: tx.status,
    createdAt: `${tx.createdAt.toLocaleDateString("id-ID")} ${tx.createdAt.toLocaleTimeString("id-ID")}`,
    target: {
      name: tx.target.name,
      user: {
        name: tx.target.user.name,
        email: tx.target.user.email,
      },
    },
  }));

  return (
    <AdminView
      adminEmail={session.user?.email ?? "admin@tabungsans.com"}
      totalDanaKelolaan={totalDanaKelolaan}
      users={users}
      pending={pending}
      allTransactions={allTransactions}
    />
  );
}
