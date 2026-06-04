import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function InstructorCoursesPage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN")) {
    return <div className="p-8 text-center">Yetkiniz yok.</div>;
  }

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Kurslarım</h1>
          <p className="text-muted-foreground">{courses.length} kurs</p>
        </div>
        <Button asChild>
          <Link href="/instructor/courses/new">Yeni Kurs</Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">Henüz kurs oluşturmadın</p>
            <Button asChild>
              <Link href="/instructor/courses/new">İlk Kursu Oluştur</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant={course.published ? "default" : "secondary"}>
                      {course.published ? "Yayında" : "Taslak"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course._count.lessons} ders · {course._count.enrollments} öğrenci
                    {course.price === 0 ? " · Ücretsiz" : ` · ${course.price.toFixed(2)} ₺`}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/instructor/courses/${course.id}/edit`}>Düzenle</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
