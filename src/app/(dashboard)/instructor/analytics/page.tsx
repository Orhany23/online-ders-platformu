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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Analizler</h1>
          <p className="text-muted-foreground">
            Kurslarının genel durumu
          </p>
        </div>
        <Button asChild>
          <Link href="/instructor/courses/new">Yeni Kurs</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {totalCourses}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Toplam Kurs</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {totalLessons}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Toplam Ders
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {totalStudents}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Toplam Öğrenci
            </p>
          </CardHeader>
        </Card>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              Henüz kurs oluşturmadın
            </p>
            <Button asChild>
              <Link href="/instructor/courses/new">
                İlk Kursu Oluştur
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Kursların</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kurs</TableHead>
                  <TableHead>Ders Sayısı</TableHead>
                  <TableHead>Öğrenci</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell>{course._count.lessons}</TableCell>
                    <TableCell>
                      {course._count.enrollments}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          course.published ? "default" : "secondary"
                        }
                      >
                        {course.published ? "Yayında" : "Taslak"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
