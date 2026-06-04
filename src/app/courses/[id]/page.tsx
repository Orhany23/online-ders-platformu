import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { EnrollButton } from "./enroll-button";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: { select: { id: true, name: true, image: true } },
      lessons: { orderBy: { order: "asc" } },
      liveSessions: { orderBy: { date: "asc" }, take: 10 },
      _count: { select: { enrollments: true, lessons: true } },
    },
  });

  if (!course) notFound();

  const isInstructor = session?.user?.id === course.instructorId;
  const isAdmin = session?.user?.role === "ADMIN";

  let isEnrolled = false;
  if (session?.user?.id) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: id,
        },
      },
    });
    isEnrolled = !!enrollment;
  }

  const sidebarCta = isInstructor
    ? { label: "Kursu Düzenle", href: `/instructor/courses/${course.id}/edit` }
    : isEnrolled
      ? {
          label: "Derslere Başla",
          href: `/learn/${course.id}/${course.lessons[0]?.id ?? ""}`,
        }
      : session?.user
        ? null
        : { label: "Giriş Yap ve Kaydol", href: "/login" };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero with image */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div className="aspect-video bg-gradient-to-br from-violet-600/20 via-primary/5 to-rose-600/20 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent" />
          <div className="text-7xl opacity-30 select-none">✦</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-muted-foreground leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-4 p-4 glass rounded-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-sm font-bold text-white shadow-soft">
              {course.instructor.name?.charAt(0)?.toUpperCase() ?? "E"}
            </div>
            <div>
              <p className="font-semibold">{course.instructor.name ?? "Eğitmen"}</p>
              <p className="text-sm text-muted-foreground">Eğitmen</p>
            </div>
          </div>

          {/* Lessons */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Ders İçeriği
              <span className="text-sm font-normal text-muted-foreground">
                ({course._count.lessons} ders)
              </span>
            </h2>
            {course.lessons.length === 0 ? (
              <div className="text-center py-12 glass rounded-xl">
                <p className="text-muted-foreground">Henüz ders eklenmemiş.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {course.lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/50 transition-all card-hover"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {lesson.duration && <span>{lesson.duration} dk</span>}
                        </div>
                      </div>
                    </div>
                    {isEnrolled || isInstructor || isAdmin ? (
                      <Link
                        href={`/learn/${course.id}/${lesson.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        {lesson.videoUrl ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            İzle
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            Oku
                          </>
                        )}
                      </Link>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Kayıtlı değil</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Live Sessions */}
          {course.liveSessions.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Canlı Dersler</h2>
              <div className="space-y-3">
                {course.liveSessions.map((ls) => (
                  <div
                    key={ls.id}
                    className="flex items-center justify-between p-4 rounded-xl glass border border-border/50"
                  >
                    <div>
                      <p className="font-medium">{ls.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ls.date).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {ls.meetingLink && (
                      <a
                        href={ls.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        Katıl
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-24 space-y-6">
            <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
              <div className="text-3xl font-bold mb-6">
                {course.price === 0 ? (
                  <span className="gradient-text">Ücretsiz</span>
                ) : (
                  <>{course.price.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">₺</span></>
                )}
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span>{course._count.lessons} ders</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  <span>{course._count.enrollments} öğrenci</span>
                </div>
              </div>

              {sidebarCta ? (
                <Link
                  href={sidebarCta.href}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
                >
                  {sidebarCta.label}
                </Link>
              ) : (
                <EnrollButton courseId={course.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
