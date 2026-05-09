import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const settings = await db.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return NextResponse.json(map);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json() as Record<string, string>;
  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
  return NextResponse.json({ ok: true });
}
