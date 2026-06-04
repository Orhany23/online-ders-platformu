import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId, courseId } = await req.json();
  if (!lessonId || !courseId)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId },
    },
  });
  if (!enrollment)
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId: session.user.id, lessonId },
    },
    update: { completed: true },
    create: {
      userId: session.user.id,
      lessonId,
      courseId,
      completed: true,
    },
  });

  return NextResponse.json({ success: true });
}
