import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Tüm Kurslar</h1>
        <p className="text-muted-foreground">
          {courses.length} kurs bulundu
        </p>
      </div>

      <SearchFilter />

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">
            {q ? `"${q}" için sonuç bulunamadı` : "Henüz kurs eklenmemiş"}
          </p>
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
