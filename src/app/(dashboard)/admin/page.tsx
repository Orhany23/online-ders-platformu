import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
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
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">
        Admin <span className="gradient-text">Panel</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <p className="text-4xl font-bold gradient-text">{totalUsers}</p>
          <p className="text-sm text-muted-foreground mt-1">Toplam Kullanıcı</p>
        </div>
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <p className="text-4xl font-bold gradient-text">{totalCourses}</p>
          <p className="text-sm text-muted-foreground mt-1">Toplam Kurs</p>
        </div>
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
          <p className="text-4xl font-bold gradient-text">{totalEnrollments}</p>
          <p className="text-sm text-muted-foreground mt-1">Toplam Kayıt</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft mb-6">
        <h2 className="text-lg font-bold mb-4">Kullanıcılar</h2>
        <UsersTable users={recentUsers} />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-lg font-bold mb-2">Kurs Yönetimi</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tüm kursları görüntüle, düzenle ve yönet.
          </p>
          <Link
            href="/admin/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
          >
            Kursları Yönet
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-soft">
          <h2 className="text-lg font-bold mb-2">Öğrenci–Öğretmen Eşleştirme</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Öğretmenin branşını belirle, öğrencileri öğretmenlere ata.
          </p>
          <Link
            href="/admin/assignments"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
          >
            Eşleştirmeyi Aç
          </Link>
        </div>
      </div>
    </div>
  );
}
