import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      instructor: { select: { id: true, name: true } },
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  try {
    const { title, description, price, image } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Başlık ve açıklama gerekli" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: price ?? 0,
        image,
        instructorId: session.user.id,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Course create error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
