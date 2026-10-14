import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, targetAmount, targetDate, withdrawalOpenDate } = await req.json();

  if (!name || !targetDate || !withdrawalOpenDate) {
    return NextResponse.json({ error: "Nama, tanggal target, dan tanggal tarik wajib diisi." }, { status: 400 });
  }

  if (targetAmount != null && (typeof targetAmount !== "number" || targetAmount < 0)) {
    return NextResponse.json({ error: "Nominal target tidak valid." }, { status: 400 });
  }

  const target = await prisma.target.create({
    data: {
      userId: session.user!.id!,
      name,
      targetAmount: targetAmount ?? null,
      targetDate: new Date(targetDate),
      withdrawalOpenDate: new Date(withdrawalOpenDate),
    },
  });

  return NextResponse.json(target, { status: 201 });
}
