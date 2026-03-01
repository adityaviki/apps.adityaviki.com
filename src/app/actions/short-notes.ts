"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getShortNotes(tagName?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.shortNote.findMany({
    where: {
      userId: session.user.id,
      ...(tagName
        ? { tags: { some: { name: tagName, userId: session.user.id } } }
        : {}),
    },
    include: { tags: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getShortNote(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.shortNote.findUnique({
    where: { id, userId: session.user.id },
    include: { tags: true },
  });
}

export async function createShortNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagIds = formData.getAll("tagIds") as string[];

  if (!content?.trim()) {
    return { error: "Content is required" };
  }

  if (tagIds.length > 0) {
    const ownedTags = await prisma.tag.findMany({
      where: { id: { in: tagIds }, userId: session.user.id },
      select: { id: true },
    });
    if (ownedTags.length !== tagIds.length) {
      return { error: "Invalid tags" };
    }
  }

  await prisma.shortNote.create({
    data: {
      title: title || null,
      content,
      userId: session.user.id,
      tags: { connect: tagIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/short-notes");
  redirect("/short-notes");
}

export async function updateShortNote(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagIds = formData.getAll("tagIds") as string[];

  if (!content?.trim()) {
    return { error: "Content is required" };
  }

  if (tagIds.length > 0) {
    const ownedTags = await prisma.tag.findMany({
      where: { id: { in: tagIds }, userId: session.user.id },
      select: { id: true },
    });
    if (ownedTags.length !== tagIds.length) {
      return { error: "Invalid tags" };
    }
  }

  await prisma.shortNote.update({
    where: { id, userId: session.user.id },
    data: {
      title: title || null,
      content,
      tags: { set: tagIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/short-notes");
  redirect("/short-notes");
}

export async function deleteShortNote(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.shortNote.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/short-notes");
}
