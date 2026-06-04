import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Kurs Yönetimi</h1>

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
              {publishedCourses}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Yayındaki Kurs</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {totalEnrollments}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Toplam Kayıt</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tüm Kurslar</CardTitle>
            <form className="flex gap-2">
              <Input
                name="q"
                placeholder="Kurs ara..."
                defaultValue={q ?? ""}
                className="w-64"
              />
              <Button type="submit">Ara</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Eğitmen</TableHead>
                <TableHead>Ders</TableHead>
                <TableHead>Öğrenci</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    {course.title}
                  </TableCell>
                  <TableCell>
                    {course.instructor.name ?? course.instructor.email}
                  </TableCell>
                  <TableCell>{course._count.lessons}</TableCell>
                  <TableCell>{course._count.enrollments}</TableCell>
                  <TableCell>
                    <Badge
                      variant={course.published ? "default" : "secondary"}
                    >
                      {course.published ? "Yayında" : "Taslak"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/instructor/courses/${course.id}/edit`}
                      >
                        Düzenle
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {q
                      ? `"${q}" için sonuç bulunamadı`
                      : "Henüz kurs yok"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
