import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const meals = await db.mealEntry.findMany({
    where: { userId: user.id, date: { gte: start, lt: end } },
    include: { foodItems: true },
    orderBy: { mealType: "asc" },
  });

  return NextResponse.json(meals);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const { mealType, date, foodItems } = await req.json();

  const meal = await db.mealEntry.create({
    data: {
      userId: user.id,
      mealType,
      date: new Date(date),
      foodItems: { create: foodItems },
    },
    include: { foodItems: true },
  });

  return NextResponse.json(meal, { status: 201 });
}
