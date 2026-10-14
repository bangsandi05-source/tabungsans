import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { targetId, type, amount } = await req.json();

  if (!targetId || !type || !amount) {
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
  }

  if (!["DEPOSIT", "WITHDRAWAL"].includes(type)) {
    return NextResponse.json({ error: "Tipe transaksi tidak valid." }, { status: 400 });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Nominal harus lebih dari 0." }, { status: 400 });
  }

  // Pastikan target milik user
  const target = await prisma.target.findUnique({
    where: { id: targetId, userId: session.user!.id! },
    include: { transactions: true },
  });

  if (!target) {
    return NextResponse.json({ error: "Target tidak ditemukan." }, { status: 404 });
  }

  if (type === "WITHDRAWAL") {
    // Cek tanggal pembukaan saldo
    if (new Date() < target.withdrawalOpenDate) {
      return NextResponse.json(
        { error: "Belum memasuki tanggal pembukaan saldo." },
        { status: 400 }
      );
    }

    // Cek maks 1 pending withdrawal
    const pendingWithdrawal = target.transactions.find(
      (tx) => tx.type === "WITHDRAWAL" && tx.status === "PENDING"
    );
    if (pendingWithdrawal) {
      return NextResponse.json(
        { error: "Masih ada penarikan yang menunggu persetujuan." },
        { status: 400 }
      );
    }

    // Cek saldo cukup
    const saldo = target.transactions
      .filter((tx) => tx.status === "APPROVED")
      .reduce((s, tx) => s + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount), 0);

    if (amount > saldo) {
      return NextResponse.json({ error: "Saldo tidak cukup." }, { status: 400 });
    }
  }

  const tx = await prisma.transaction.create({
    data: { targetId, type, amount, status: "PENDING" },
  });

  return NextResponse.json(tx, { status: 201 });
}
