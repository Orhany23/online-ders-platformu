import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersTable } from "./users-table";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [totalUsers, totalCourses, totalEnrollments, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { enrollments: true, courses: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{totalUsers}</CardTitle>
            <p className="text-sm text-muted-foreground">Toplam Kullanıcı</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{totalCourses}</CardTitle>
            <p className="text-sm text-muted-foreground">Toplam Kurs</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{totalEnrollments}</CardTitle>
            <p className="text-sm text-muted-foreground">Toplam Kayıt</p>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Kullanıcılar</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={recentUsers} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kurs Yönetimi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Tüm kursları görüntüle, düzenle ve yönet.
          </p>
          <Button asChild>
            <Link href="/admin/courses">Kursları Yönet</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
