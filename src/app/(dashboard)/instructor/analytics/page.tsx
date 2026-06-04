import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InstructorAnalyticsPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")
  )
    redirect("/");

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalCourses = courses.length;
  const totalLessons = courses.reduce(
    (sum, c) => sum + c._count.lessons,
    0
  );
  const totalStudents = courses.reduce(
    (sum, c) => sum + c._count.enrollments,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">Analizler</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Kurslarının genel durumu
          </p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] active:scale-[0.98] flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Yeni Kurs
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <p className="text-4xl font-bold gradient-text">{totalCourses}</p>
          <p className="text-sm text-muted-foreground mt-1">Toplam Kurs</p>
        </div>
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <p className="text-4xl font-bold gradient-text">{totalLessons}</p>
          <p className="text-sm text-muted-foreground mt-1">Toplam Ders</p>
        </div>
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <p className="text-4xl font-bold gradient-text">{totalStudents}</p>
          <p className="text-sm text-muted-foreground mt-1">Toplam Öğrenci</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="glass rounded-2xl border border-border/50 p-16 text-center shadow-soft">
          <div className="text-5xl mb-4 text-muted-foreground/30">✦</div>
          <p className="text-lg text-muted-foreground mb-6">
            Henüz kurs oluşturmadın
          </p>
          <Link
            href="/instructor/courses/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
          >
            İlk Kursu Oluştur
          </Link>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <h2 className="text-lg font-bold mb-4">Kursların</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left font-medium text-muted-foreground py-3 px-3">Kurs</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-3">Ders Sayısı</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-3">Öğrenci</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-3">Durum</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-border/25 hover:bg-accent/30 transition-colors">
                    <td className="font-medium py-3 px-3">{course.title}</td>
                    <td className="py-3 px-3">{course._count.lessons}</td>
                    <td className="py-3 px-3">{course._count.enrollments}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        course.published
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {course.published ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
