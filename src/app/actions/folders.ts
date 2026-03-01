"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFolders() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.folder.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
    include: { _count: { select: { longNotes: true } } },
  });
}

export async function createFolder(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const folder = await prisma.folder.create({
    data: { name, userId: session.user.id },
  });

  revalidatePath("/long-notes");
  return folder;
}

export async function deleteFolder(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.folder.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/long-notes");
}
