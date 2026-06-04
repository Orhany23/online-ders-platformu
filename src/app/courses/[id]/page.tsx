import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="aspect-video bg-muted rounded-xl flex items-center justify-center text-6xl mb-8">
        🎬
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground mb-6">{course.description}</p>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
              {course.instructor.name?.charAt(0) ?? "E"}
            </div>
            <div>
              <p className="font-medium">{course.instructor.name ?? "Eğitmen"}</p>
              <p className="text-sm text-muted-foreground">Eğitmen</p>
            </div>
          </div>

          {/* Lessons */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              Ders İçeriği ({course._count.lessons} ders)
            </h2>
            {course.lessons.length === 0 ? (
              <p className="text-muted-foreground">Henüz ders eklenmemiş.</p>
            ) : (
              <div className="space-y-2">
                {course.lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-8">
                        {i + 1}.
                      </span>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        {lesson.duration && (
                          <p className="text-sm text-muted-foreground">
                            {lesson.duration} dk
                          </p>
                        )}
                      </div>
                    </div>
                    {isEnrolled || isInstructor || isAdmin ? (
                      <Link href={`/learn/${course.id}/${lesson.id}`}>
                        <Button variant="ghost" size="sm">
                          {lesson.videoUrl ? "▶ İzle" : "📄"}
                        </Button>
                      </Link>
                    ) : (
                      <Badge variant="secondary">Kayıtlı değil</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Live Sessions */}
          {course.liveSessions.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Canlı Dersler</h2>
              <div className="space-y-3">
                {course.liveSessions.map((ls) => (
                  <Card key={ls.id}>
                    <CardContent className="flex items-center justify-between p-4">
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
                        <Button variant="outline" size="sm" asChild>
                          <a href={ls.meetingLink} target="_blank" rel="noopener noreferrer">
                            Katıl
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {course.price === 0 ? (
                  <span className="text-green-600">Ücretsiz</span>
                ) : (
                  `${course.price.toFixed(2)} ₺`
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>📚 {course._count.lessons} ders</p>
                <p>👥 {course._count.enrollments} öğrenci</p>
              </div>

              {isInstructor ? (
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/instructor/courses/${course.id}/edit`}>
                    Kursu Düzenle
                  </Link>
                </Button>
              ) : isEnrolled ? (
                <Button className="w-full" asChild>
                  <Link href={`/learn/${course.id}/${course.lessons[0]?.id ?? ""}`}>
                    Derslere Başla
                  </Link>
                </Button>
              ) : session?.user ? (
                <EnrollButton courseId={course.id} />
              ) : (
                <Button className="w-full" asChild>
                  <Link href="/login">Giriş Yap ve Kaydol</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
