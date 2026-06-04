import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditCourseForm } from "./edit-form";
import { LessonsManager } from "./lessons-manager";
import { LiveSessionsManager } from "./live-sessions-manager";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: "asc" } },
      liveSessions: { orderBy: { date: "asc" } },
    },
  });

  if (!course) notFound();
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return <div className="p-8 text-center">Bu kursu düzenleme yetkiniz yok.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Kursu Düzenle: {course.title}</h1>

      <div className="space-y-10">
        <EditCourseForm course={course} />
        <LessonsManager courseId={course.id} lessons={course.lessons} />
        <LiveSessionsManager
          courseId={course.id}
          sessions={course.liveSessions.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            date: s.date.toISOString(),
            meetingLink: s.meetingLink,
          }))}
        />
      </div>
    </div>
  );
}
