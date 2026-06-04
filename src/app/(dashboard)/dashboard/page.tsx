import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  // Get progress for each course
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Öğrenme Paneli</h1>
        <p className="text-muted-foreground mt-1">
          Merhaba, {session.user.name ?? "Öğrenci"}
        </p>
      </div>

      {/* Enrolled Courses */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Kurslarım</h2>
        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Henüz bir kursa kaydolmadın
              </p>
              <Button asChild>
                <Link href="/courses">Kursları Keşfet</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              const progress = progressMap.get(enrollment.courseId) ?? 0;
              const firstLesson = enrollment.course.lessons[0];

              return (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center text-4xl">
                      🎬
                    </div>
                    <CardTitle className="text-lg">
                      {enrollment.course.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {enrollment.course.instructor.name ?? "Eğitmen"}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>İlerleme</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    {firstLesson && (
                      <Button className="w-full" asChild>
                        <Link
                          href={`/learn/${enrollment.courseId}/${firstLesson.id}`}
                        >
                          Devam Et
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming Live Sessions */}
      {liveSessions.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Yaklaşan Canlı Dersler</h2>
          <div className="space-y-3">
            {liveSessions.map((ls) => (
              <Card key={ls.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{ls.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {ls.course.title} —{" "}
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
                      <a
                        href={ls.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
  );
}
