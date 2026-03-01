"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeEditorHtml } from "@/lib/sanitize";
import { startOfMonth, endOfMonth } from "date-fns";

export async function upsertDailyNote(dateStr: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const date = new Date(dateStr + "T00:00:00.000Z");

  return prisma.dailyNote.upsert({
    where: {
      userId_date: { userId: session.user.id, date },
    },
    update: {},
    create: {
      date,
      content: "",
      userId: session.user.id,
    },
  });
}

export async function getDailyNote(dateStr: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const date = new Date(dateStr + "T00:00:00.000Z");

  return prisma.dailyNote.findUnique({
    where: {
      userId_date: { userId: session.user.id, date },
    },
  });
}

export async function updateDailyNoteContent(dateStr: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const date = new Date(dateStr + "T00:00:00.000Z");
  const sanitized = sanitizeEditorHtml(content);

  await prisma.dailyNote.upsert({
    where: {
      userId_date: { userId: session.user.id, date },
    },
    update: { content: sanitized },
    create: {
      date,
      content: sanitized,
      userId: session.user.id,
    },
  });
}

export async function getDatesWithContent(year: number, month: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));

  const notes = await prisma.dailyNote.findMany({
    where: {
      userId: session.user.id,
      date: { gte: start, lte: end },
      content: { not: "" },
    },
    select: { date: true },
  });

  return notes.map((n: { date: Date }) => n.date.toISOString().split("T")[0]);
}
