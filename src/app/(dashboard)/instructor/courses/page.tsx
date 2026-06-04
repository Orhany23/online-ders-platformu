import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InstructorCoursesPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4 text-muted-foreground/30">✦</div>
        <p className="text-lg text-muted-foreground">Yetkiniz yok.</p>
      </div>
    );
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">Kurslarım</span>
          </h1>
          <p className="text-muted-foreground mt-1">{courses.length} kurs</p>
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

      {courses.length === 0 ? (
        <div className="glass rounded-2xl border border-border/50 p-16 text-center shadow-soft">
          <div className="text-5xl mb-4 text-muted-foreground/30">✦</div>
          <p className="text-lg text-muted-foreground mb-6">Henüz kurs oluşturmadın</p>
          <Link
            href="/instructor/courses/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
          >
            İlk Kursu Oluştur
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass rounded-2xl border border-border/50 p-6 shadow-soft transition-all hover:shadow-soft-lg card-hover"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg truncate">{course.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${
                      course.published
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {course.published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course._count.lessons} ders &middot; {course._count.enrollments} öğrenci
                    {course.price === 0 ? " &middot; Ücretsiz" : ` &middot; ${course.price.toFixed(2)} ₺`}
                  </p>
                </div>
                <Link
                  href={`/instructor/courses/${course.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] active:scale-[0.98] flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Düzenle
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
