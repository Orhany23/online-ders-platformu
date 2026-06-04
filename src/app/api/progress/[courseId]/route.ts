import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await params;

  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId: session.user.id,
      courseId,
      completed: true,
    },
    select: { lessonId: true },
  });

  return NextResponse.json({
    completedLessonIds: progress.map((p) => p.lessonId),
  });
}
