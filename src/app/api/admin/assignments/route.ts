import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

// GET: tüm öğretmenler, öğrenciler ve eşleştirmeler (admin eşleştirme ekranı için)
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [teachers, students, assignments] = await Promise.all([
    prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      select: { id: true, name: true, email: true, branch: true, teacherKind: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.assignment.findMany({
      select: {
        id: true,
        teacherId: true,
        studentId: true,
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({ teachers, students, assignments });
}

// POST: öğrenciyi öğretmene ata
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { teacherId, studentId } = await req.json().catch(() => ({}));
  if (!teacherId || !studentId) {
    return NextResponse.json({ error: "Öğretmen ve öğrenci seçilmeli." }, { status: 400 });
  }

  // doğrula: roller doğru mu
  const [teacher, student] = await Promise.all([
    prisma.user.findUnique({ where: { id: teacherId }, select: { role: true } }),
    prisma.user.findUnique({ where: { id: studentId }, select: { role: true } }),
  ]);
  if (teacher?.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Seçilen kişi öğretmen değil." }, { status: 400 });
  }
  if (student?.role !== "STUDENT") {
    return NextResponse.json({ error: "Seçilen kişi öğrenci değil." }, { status: 400 });
  }

  try {
    const assignment = await prisma.assignment.create({
      data: { teacherId, studentId },
      select: {
        id: true,
        teacherId: true,
        studentId: true,
        student: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json({ assignment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bu öğrenci zaten bu öğretmene atanmış." }, { status: 409 });
  }
}
