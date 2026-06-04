import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const { q } = await searchParams;

  const [courses, totalCourses, publishedCourses, totalEnrollments] =
    await Promise.all([
      prisma.course.findMany({
        where: q ? { title: { contains: q } } : undefined,
        include: {
          instructor: { select: { name: true, email: true } },
          _count: { select: { lessons: true, enrollments: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.enrollment.count(),
    ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">
        Kurs <span className="gradient-text">Yönetimi</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <p className="text-4xl font-bold gradient-text">{totalCourses}</p>
          <p className="text-sm text-muted-foreground mt-1">Toplam Kurs</p>
        </div>
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <p className="text-4xl font-bold gradient-text">{publishedCourses}</p>
          <p className="text-sm text-muted-foreground mt-1">Yayındaki Kurs</p>
        </div>
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <p className="text-4xl font-bold gradient-text">{totalEnrollments}</p>
          <p className="text-sm text-muted-foreground mt-1">Toplam Kayıt</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold">Tüm Kurslar</h2>
          <form className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              name="q"
              placeholder="Kurs ara..."
              defaultValue={q ?? ""}
              className="flex h-10 w-64 rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left font-medium text-muted-foreground py-3 px-3">Başlık</th>
                <th className="text-left font-medium text-muted-foreground py-3 px-3">Eğitmen</th>
                <th className="text-left font-medium text-muted-foreground py-3 px-3">Ders</th>
                <th className="text-left font-medium text-muted-foreground py-3 px-3">Öğrenci</th>
                <th className="text-left font-medium text-muted-foreground py-3 px-3">Durum</th>
                <th className="text-left font-medium text-muted-foreground py-3 px-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-border/25 hover:bg-accent/30 transition-colors">
                  <td className="font-medium py-3 px-3">{course.title}</td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {course.instructor.name ?? course.instructor.email}
                  </td>
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
                  <td className="py-3 px-3">
                    <Link
                      href={`/instructor/courses/${course.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-background px-3.5 py-1.5 text-xs font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    {q
                      ? `"${q}" için sonuç bulunamadı`
                      : "Henüz kurs yok"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
