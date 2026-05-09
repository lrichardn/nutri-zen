import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function checkAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const slots = await db.availableSlot.findMany({
    orderBy: { date: "asc" },
    include: { appointment: { select: { name: true, email: true, type: true } } },
  });
  return NextResponse.json(slots);
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const { date, duration } = await req.json();
  const slot = await db.availableSlot.create({
    data: { date: new Date(date), duration: duration ?? 60 },
  });
  return NextResponse.json(slot, { status: 201 });
}
