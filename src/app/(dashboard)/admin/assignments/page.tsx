import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentsManager } from "./assignments-manager";

export default async function AssignmentsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">
        Öğrenci–Öğretmen <span className="gradient-text">Eşleştirme</span>
      </h1>
      <p className="text-muted-foreground mb-10">
        Bir öğretmen seç, branşını belirle ve öğrencileri ata.
      </p>
      <AssignmentsManager
        teachers={teachers}
        students={students}
        initialAssignments={assignments}
      />
    </div>
  );
}
