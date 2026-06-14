import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [enrollments, liveSessions] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            lessons: { orderBy: { order: "asc" }, take: 1 },
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.liveSession.findMany({
      where: {
        course: {
          enrollments: {
            some: { userId: session.user.id },
          },
        },
        date: { gte: new Date() },
      },
      include: { course: { select: { title: true } } },
      orderBy: { date: "asc" },
      take: 5,
    }),
  ]);

  const progressMap = new Map<string, number>();
  for (const enrollment of enrollments) {
    const total = enrollment.course._count.lessons;
    if (total > 0) {
      const completed = await prisma.lessonProgress.count({
        where: {
          userId: session.user.id,
          courseId: enrollment.courseId,
          completed: true,
        },
      });
      progressMap.set(enrollment.courseId, Math.round((completed / total) * 100));
    } else {
      progressMap.set(enrollment.courseId, 0);
    }
  }

  const myTeachers = await prisma.assignment.findMany({
    where: { studentId: session.user.id },
    select: {
      id: true,
      teacher: { select: { name: true, email: true, branch: true, teacherKind: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-1">
          Öğrenme <span className="gradient-text">Paneli</span>
        </h1>
        <p className="text-muted-foreground">
          Merhaba, {session.user.name ?? "Öğrenci"}
        </p>
      </div>

      {myTeachers.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Öğretmenim / Koçum</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myTeachers.map((a) => (
              <div key={a.id} className="glass-card rounded-2xl p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {(a.teacher.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{a.teacher.name ?? "Öğretmen"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {a.teacher.branch || "Branş belirtilmedi"}
                      {a.teacher.teacherKind === "KOCLUK"
                        ? " · Koçluk"
                        : a.teacher.teacherKind === "DERS"
                        ? " · Ders"
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">Kurslarım</h2>
        {enrollments.length === 0 ? (
          <div className="glass rounded-2xl border border-border/50 p-16 text-center shadow-soft">
            <div className="text-5xl mb-4 text-muted-foreground/30">✦</div>
            <p className="text-lg text-muted-foreground mb-6">
              Henüz bir kursa kaydolmadın
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
            >
              Kursları Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              const progress = progressMap.get(enrollment.courseId) ?? 0;
              const firstLesson = enrollment.course.lessons[0];

              return (
                <div
                  key={enrollment.id}
                  className="glass rounded-2xl border border-border/50 overflow-hidden shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-2px]"
                >
                  <div className="aspect-video bg-gradient-to-br from-violet-600/20 via-primary/5 to-rose-600/20 flex items-center justify-center">
                    <div className="text-4xl opacity-30 select-none">✦</div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {enrollment.course.instructor.name ?? "Eğitmen"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">İlerleme</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            background:
                              "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--rose-500, var(--primary))))",
                          }}
                        />
                      </div>
                    </div>
                    {firstLesson && (
                      <Link
                        href={`/learn/${enrollment.courseId}/${firstLesson.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
                      >
                        Devam Et
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {liveSessions.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6">Yaklaşan Canlı Dersler</h2>
          <div className="space-y-3">
            {liveSessions.map((ls) => (
              <div
                key={ls.id}
                className="flex items-center justify-between p-4 rounded-xl glass border border-border/50 shadow-soft transition-all hover:shadow-soft-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white shadow-soft">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{ls.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {ls.course.title} &mdash;{" "}
                      {new Date(ls.date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {ls.meetingLink && (
                  <a
                    href={ls.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
                  >
                    Katıl
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
