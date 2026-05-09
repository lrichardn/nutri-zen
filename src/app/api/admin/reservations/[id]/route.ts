import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function checkAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const { id } = await params;
  const { status } = await req.json();
  const updated = await db.appointment.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const { id } = await params;
  await db.appointment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
