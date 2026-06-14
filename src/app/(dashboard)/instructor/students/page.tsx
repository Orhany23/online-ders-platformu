import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InstructorStudentsPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    redirect("/");
  }

  const assignments = await prisma.assignment.findMany({
    where: { teacherId: session.user.id },
    select: {
      id: true,
      createdAt: true,
      student: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-1">
        Öğrenci<span className="gradient-text">lerim</span>
      </h1>
      <p className="text-muted-foreground mb-10">
        Sana atanan öğrenciler. Atamaları yönetici yapar.
      </p>

      {assignments.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
          Henüz sana öğrenci atanmadı.
        </div>
      ) : (
        <div className="space-y-2">
          {assignments.map((a) => (
            <div key={a.id} className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold">
                {(a.student.name ?? "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{a.student.name ?? "-"}</p>
                <p className="text-xs text-muted-foreground truncate">{a.student.email}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(a.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
