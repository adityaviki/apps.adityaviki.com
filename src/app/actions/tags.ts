"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getTags() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.tag.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });
}

export async function createTag(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.tag.upsert({
    where: { userId_name: { userId: session.user.id, name } },
    update: {},
    create: { name, userId: session.user.id },
  });
}

export async function deleteTag(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.tag.delete({
    where: { id, userId: session.user.id },
  });
}
