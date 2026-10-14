import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
  }

  const role = (session.user as unknown as { role?: string })?.role;
  if (role !== "ADMIN") {
    return NextResponse.json(
      { error: "Akses ditolak. Hanya Admin yang dapat mereset kata sandi." },
      { status: 403 }
    );
  }

  const { userId, newPassword } = await req.json();

  if (!userId || !newPassword) {
    return NextResponse.json(
      { error: "ID pengguna dan kata sandi baru wajib disertakan." },
      { status: 400 }
    );
  }

  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json(
      { error: "Kata sandi baru minimal 6 karakter." },
      { status: 400 }
    );
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!targetUser) {
    return NextResponse.json(
      { error: "Penabung tidak ditemukan." },
      { status: 404 }
    );
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  return NextResponse.json({ ok: true });
}
