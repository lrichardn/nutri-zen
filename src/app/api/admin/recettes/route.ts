import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function checkAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "ADMIN";
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const data = await req.json();
  const recipe = await db.recipe.create({ data });
  return NextResponse.json(recipe, { status: 201 });
}
