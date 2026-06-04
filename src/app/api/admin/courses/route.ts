import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const courses = await prisma.course.findMany({
    where: q ? { title: { contains: q } } : undefined,
    include: {
      instructor: { select: { name: true, email: true } },
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}
