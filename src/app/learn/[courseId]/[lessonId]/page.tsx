import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  // Check enrollment or ownership
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
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Bu kursa kayıtlı değilsin</h1>
          <p className="text-muted-foreground mb-6">
            Bu dersi izlemek için kursa kaydolmalısın.
          </p>
          <Button asChild>
            <Link href={`/courses/${courseId}`}>Kurs Sayfasına Git</Link>
          </Button>
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <Link href={`/courses/${courseId}`} className="hover:text-primary">
          {course.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{lesson.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video / Content Area */}
        <div className="lg:col-span-2">
          {lesson.videoUrl ? (
            <YouTubeEmbed url={lesson.videoUrl} title={lesson.title} />
          ) : (
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center text-6xl mb-6">
              📄
            </div>
          )}

          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-muted-foreground mb-6">{lesson.description}</p>
          )}

          <div className="mb-6">
            <CompleteLessonButton
              lessonId={lesson.id}
              courseId={courseId}
              initiallyCompleted={lessonCompleted}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link
                  href={`/learn/${courseId}/${prevLesson.id}`}
                >
                  ← Önceki Ders
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Button asChild>
                <Link
                  href={`/learn/${courseId}/${nextLesson.id}`}
                >
                  Sonraki Ders →
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href={`/courses/${courseId}`}>Kurs Tamamlandı 🎉</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar - Lesson List */}
        <div>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Ders Listesi</h3>
              <div className="space-y-1">
                {course.lessons.map((l, i) => (
                  <Link
                    key={l.id}
                    href={`/learn/${courseId}/${l.id}`}
                    className={`flex items-center gap-3 p-2 rounded-md text-sm transition-colors ${
                      l.id === lessonId
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      {i + 1}
                    </span>
                    <span className="flex-1 truncate">{l.title}</span>
                    {l.duration && (
                      <span className="text-xs text-muted-foreground">
                        {l.duration}dk
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
