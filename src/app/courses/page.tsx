import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SearchFilter } from "./search-filter";
import { CourseCard } from "@/components/course-card";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const courses = await prisma.course.findMany({
    where: {
      published: true,
      ...(q
        ? {
            title: { contains: q },
          }
        : {}),
    },
    include: {
      instructor: { select: { name: true } },
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
          Tüm <span className="gradient-text">Kurslar</span>
        </h1>
        <p className="text-muted-foreground">
          {courses.length} kurs bulundu
        </p>
      </div>

      <SearchFilter />

      {courses.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4 text-muted-foreground/30">✦</div>
          <p className="text-xl font-medium text-muted-foreground mb-1">
            {q ? `"${q}" için sonuç bulunamadı` : "Henüz kurs eklenmemiş"}
          </p>
          <p className="text-sm text-muted-foreground/60 mb-6">
            {q ? "Farklı bir arama terimi dene" : "Yakında yeni kurslar eklenecek"}
          </p>
          {q && (
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg"
            >
              Tüm Kursları Göster
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
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
      )}
    </div>
  );
}
