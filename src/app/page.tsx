import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";

export default async function HomePage() {
  const featuredCourses = await prisma.course.findMany({
    where: { published: true },
    include: {
      instructor: { select: { name: true } },
      _count: { select: { lessons: true, enrollments: true } },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Online Derslerle
            <span className="text-primary"> Kendini Geliştir</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Uzman eğitmenlerden canlı ve kayıtlı derslerle öğrenmeye başla.
            İstediğin zaman, istediğin yerden.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/courses">Kursları Keşfet</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/register">Hemen Kaydol</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl">📹</CardTitle>
                <CardTitle>Kayıtlı Dersler</CardTitle>
                <CardDescription>
                  İstediğin zaman izle, kendi hızında öğren. Tüm dersler kayıt altında.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl">🎯</CardTitle>
                <CardTitle>Canlı Dersler</CardTitle>
                <CardDescription>
                  Eğitmenlerle birebir canlı dersler, anında soru sor, anında cevap al.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl">🏆</CardTitle>
                <CardTitle>Her Seviyeye Uygun</CardTitle>
                <CardDescription>
                  Başlangıçtan ileri seviyeye, herkes için dersler. Sana uygun olanı bul.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10">Son Eklenen Kurslar</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  image={course.image}
                  price={course.price}
                  instructorName={course.instructor.name}
                  lessonCount={course._count.lessons}
                  enrollmentCount={course._count.enrollments}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Fiberan. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
