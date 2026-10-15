import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
  }

  const role = (session.user as unknown as { role?: string })?.role;
  if (role !== "ADMIN") {
    return NextResponse.json(
      { error: "Akses ditolak. Hanya Admin yang dapat menghapus akun penabung." },
      { status: 403 }
    );
  }

  const { id } = await params;

  const targetUser = await prisma.user.findUnique({
    where: { id },
    include: {
      targets: {
        include: {
          transactions: true,
        },
      },
    },
  });

  if (!targetUser) {
    return NextResponse.json(
      { error: "Penabung tidak ditemukan." },
      { status: 404 }
    );
  }

  if (targetUser.role === "ADMIN") {
    return NextResponse.json(
      { error: "Akun Administrator tidak dapat dihapus." },
      { status: 400 }
    );
  }

  // Hitung total saldo dan cek permohonan pending
  let totalSaldo = 0;
  let hasPending = false;

  for (const t of targetUser.targets) {
    for (const tx of t.transactions) {
      if (tx.status === "PENDING") {
        hasPending = true;
      } else if (tx.status === "APPROVED") {
        totalSaldo += tx.type === "DEPOSIT" ? tx.amount : -tx.amount;
      }
    }
  }

  if (hasPending) {
    return NextResponse.json(
      {
        error:
          "Penabung masih memiliki permohonan transaksi yang menunggu verifikasi.",
      },
      { status: 400 }
    );
  }

  if (totalSaldo > 0) {
    return NextResponse.json(
      {
        error: `Penabung masih memiliki saldo aktif (Rp ${totalSaldo.toLocaleString(
          "id-ID"
        )}). Pastikan saldo sudah ditarik habis sebelum menghapus akun.`,
      },
      { status: 400 }
    );
  }

  // Hapus akun penabung (cascade delete targets & transactions)
  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
