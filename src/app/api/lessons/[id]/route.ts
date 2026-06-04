import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verifyOwnership(lessonId: string, userId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: { select: { instructorId: true } } },
  });
  if (!lesson) return { error: "Ders bulunamadı", status: 404 };
  if (lesson.course.instructorId !== userId) return { error: "Yetkiniz yok", status: 403 };
  return { lesson };
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const check = await verifyOwnership(id, session.user.id);
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  try {
    const { title, description, videoUrl, duration, order } = await req.json();
    const updated = await prisma.lesson.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(duration !== undefined && { duration }),
        ...(order !== undefined && { order }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Lesson update error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const check = await verifyOwnership(id, session.user.id);
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  await prisma.lesson.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
