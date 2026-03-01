"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeEditorHtml } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getLongNotes(folderId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.longNote.findMany({
    where: {
      userId: session.user.id,
      ...(folderId === "uncategorized"
        ? { folderId: null }
        : folderId
          ? { folderId }
          : {}),
    },
    include: { folder: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getLongNote(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.longNote.findUnique({
    where: { id, userId: session.user.id },
    include: { folder: true },
  });
}

export async function createLongNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const folderId = formData.get("folderId") as string;

  if (!title?.trim()) {
    return { error: "Title is required" };
  }

  if (folderId) {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId, userId: session.user.id },
    });
    if (!folder) return { error: "Folder not found" };
  }

  const note = await prisma.longNote.create({
    data: {
      title,
      content: "",
      userId: session.user.id,
      folderId: folderId || null,
    },
  });

  redirect(`/long-notes/${note.id}`);
}

export async function updateLongNoteContent(id: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.longNote.update({
    where: { id, userId: session.user.id },
    data: { content: sanitizeEditorHtml(content) },
  });
}

export async function updateLongNote(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const folderId = formData.get("folderId") as string;

  if (folderId) {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId, userId: session.user.id },
    });
    if (!folder) return { error: "Folder not found" };
  }

  await prisma.longNote.update({
    where: { id, userId: session.user.id },
    data: {
      title: title || undefined,
      folderId: folderId || null,
    },
  });

  revalidatePath("/long-notes");
}

export async function deleteLongNote(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.longNote.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/long-notes");
}
