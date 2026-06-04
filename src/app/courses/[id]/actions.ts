"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Giriş yapmalısınız" };
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return { error: "Kurs bulunamadı" };
  }

  if (course.instructorId === session.user.id) {
    return { error: "Kendi kursuna kaydolamazsın" };
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  if (existing) {
    return { error: "Zaten bu kursa kayıtlısın" };
  }

  await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId,
    },
  });

  revalidatePath(`/courses/${courseId}`);
  return { success: true, message: "Kursa başarıyla kaydoldun!" };
}
