import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as unknown as { role?: string })?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { txId, status } = await req.json();

  if (!txId || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const tx = await prisma.transaction.findUnique({ where: { id: txId } });
  if (!tx || tx.status !== "PENDING") {
    return NextResponse.json({ error: "Transaksi tidak ditemukan atau sudah diproses." }, { status: 404 });
  }

  const updated = await prisma.transaction.update({
    where: { id: txId },
    data: { status, reviewedAt: new Date() },
  });

  return NextResponse.json(updated);
}
