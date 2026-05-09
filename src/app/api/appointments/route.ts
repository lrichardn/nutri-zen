import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, phone, type, message, slotId } = await req.json();

  if (!name || !email || !type) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  if (slotId) {
    const slot = await db.availableSlot.findUnique({ where: { id: slotId } });
    if (!slot || slot.booked) {
      return NextResponse.json({ error: "Ce créneau n'est plus disponible." }, { status: 409 });
    }
  }

  await db.$transaction(async (tx) => {
    await tx.appointment.create({
      data: {
        name, email,
        phone: phone || null,
        type, message: message || null,
        slotId: slotId || null,
      },
    });
    if (slotId) {
      await tx.availableSlot.update({ where: { id: slotId }, data: { booked: true } });
    }
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
