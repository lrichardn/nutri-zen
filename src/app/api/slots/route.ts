import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth()));

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);

  const slots = await db.availableSlot.findMany({
    where: { date: { gte: start, lte: end }, booked: false },
    orderBy: { date: "asc" },
    select: { id: true, date: true, duration: true },
  });

  return NextResponse.json(slots);
}
