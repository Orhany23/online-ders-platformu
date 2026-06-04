import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: { select: { id: true, name: true, image: true } },
      lessons: { orderBy: { order: "asc" } },
      liveSessions: { orderBy: { date: "asc" } },
      _count: { select: { enrollments: true, lessons: true } },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Kurs bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(course);
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

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    return NextResponse.json({ error: "Kurs bulunamadı" }, { status: 404 });
  }

  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Bu kursu düzenleme yetkiniz yok" }, { status: 403 });
  }

  try {
    const { title, description, price, image, published } = await req.json();

    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(image !== undefined && { image }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Course update error:", error);
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

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    return NextResponse.json({ error: "Kurs bulunamadı" }, { status: 404 });
  }

  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  await prisma.lesson.deleteMany({ where: { courseId: id } });
  await prisma.liveSession.deleteMany({ where: { courseId: id } });
  await prisma.lessonProgress.deleteMany({ where: { courseId: id } });
  await prisma.enrollment.deleteMany({ where: { courseId: id } });
  await prisma.course.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
