import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { CompleteLessonButton } from "@/components/complete-lesson-button";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const session = await auth();

  if (!session?.user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: { select: { id: true } },
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!course) notFound();

  const isOwner = course.instructorId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });
    if (!enrollment) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="text-5xl mb-4 text-muted-foreground/30">✦</div>
          <h1 className="text-2xl font-bold mb-3">Bu kursa kayıtlı değilsin</h1>
          <p className="text-muted-foreground mb-8">
            Bu dersi izlemek için kursa kaydolmalısın.
          </p>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
          >
            Kurs Sayfasına Git
          </Link>
        </div>
      );
    }
  }

  const lesson = course.lessons.find((l) => l.id === lessonId);
  if (!lesson) notFound();

  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < course.lessons.length - 1
      ? course.lessons[currentIndex + 1]
      : null;

  let lessonCompleted = false;
  if (session?.user && !isOwner && !isAdmin) {
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
    });
    lessonCompleted = progress?.completed ?? false;
  }

  const btnBase = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]";
  const btnPrimary = `${btnBase} bg-primary text-primary-foreground`;
  const btnOutline = `${btnBase} border border-input bg-background`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-muted-foreground flex items-center gap-2">
        <Link href={`/courses/${courseId}`} className="hover:text-primary transition-colors">
          {course.title}
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground font-medium">{lesson.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {lesson.videoUrl ? (
            <YouTubeEmbed url={lesson.videoUrl} title={lesson.title} />
          ) : (
            <div className="aspect-video bg-gradient-to-br from-violet-600/20 via-primary/5 to-rose-600/20 rounded-2xl flex items-center justify-center">
              <div className="text-6xl opacity-30 select-none">✦</div>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-muted-foreground leading-relaxed">{lesson.description}</p>
            )}
          </div>

          <CompleteLessonButton
            lessonId={lesson.id}
            courseId={courseId}
            initiallyCompleted={lessonCompleted}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            {prevLesson ? (
              <Link href={`/learn/${courseId}/${prevLesson.id}`} className={btnOutline}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Önceki Ders
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link href={`/learn/${courseId}/${nextLesson.id}`} className={btnPrimary}>
                Sonraki Ders
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : (
              <Link href={`/courses/${courseId}`} className={`${btnOutline} gap-2`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
                Kurs Tamamlandı
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar - Lesson List */}
        <div>
          <div className="sticky top-24 glass rounded-2xl border border-border/50 p-5 shadow-soft">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Ders Listesi
            </h3>
            <div className="space-y-1">
              {course.lessons.map((l, i) => (
                <Link
                  key={l.id}
                  href={`/learn/${courseId}/${l.id}`}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-sm transition-all ${
                    l.id === lessonId
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    l.id === lessonId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate">{l.title}</span>
                  {l.duration && (
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {l.duration}dk
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
