import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "Kurs ID gerekli" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Kurs bulunamadı" }, { status: 404 });
    }

    if (course.instructorId === session.user.id) {
      return NextResponse.json(
        { error: "Kendi kursuna kaydolamazsın" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: "Zaten bu kursa kayıtlısın" },
        { status: 409 }
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
