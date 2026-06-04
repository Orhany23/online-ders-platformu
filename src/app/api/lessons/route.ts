import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const { title, description, videoUrl, duration, order, courseId } = await req.json();

    if (!title || !courseId) {
      return NextResponse.json(
        { error: "Başlık ve kurs ID gerekli" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Kurs bulunamadı" }, { status: 404 });
    }

    if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const lesson = await prisma.lesson.create({
      data: { title, description, videoUrl, duration, order: order ?? 0, courseId },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Lesson create error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
