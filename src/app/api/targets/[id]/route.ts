import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
  }

  const { id } = await params;

  const target = await prisma.target.findUnique({
    where: { id, userId: session.user.id },
    include: { transactions: true },
  });

  if (!target) {
    return NextResponse.json(
      { error: "Target tabungan tidak ditemukan." },
      { status: 404 }
    );
  }

  // Cek apakah ada transaksi pending
  const hasPending = target.transactions.some((tx) => tx.status === "PENDING");
  if (hasPending) {
    return NextResponse.json(
      {
        error:
          "Target tidak dapat ditutup karena masih ada transaksi yang menunggu verifikasi Admin.",
      },
      { status: 400 }
    );
  }

  // Cek apakah saldo sudah 0
  const saldo = target.transactions
    .filter((tx) => tx.status === "APPROVED")
    .reduce((s, tx) => s + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount), 0);

  if (saldo > 0) {
    return NextResponse.json(
      {
        error:
          "Target tidak dapat dihapus karena masih ada saldo tersisa. Tarik seluruh saldo terlebih dahulu.",
      },
      { status: 400 }
    );
  }

  // Hapus target (transaksi terhapus otomatis via cascade)
  await prisma.target.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
