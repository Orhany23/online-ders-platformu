import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CourseCardProps = {
  id: string;
  title: string;
  image: string | null;
  price: number;
  instructorName: string | null;
  lessonCount: number;
  enrollmentCount: number;
};

export function CourseCard({
  id,
  title,
  image,
  price,
  instructorName,
  lessonCount,
  enrollmentCount,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          {image ? (
            <div className="aspect-video rounded-lg mb-3 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center text-4xl">
              🎬
            </div>
          )}
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{instructorName ?? "Eğitmen"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {lessonCount} ders · {enrollmentCount} öğrenci
            </span>
            <span className="font-semibold">
              {price === 0 ? (
                <span className="text-green-600">Ücretsiz</span>
              ) : (
                `${price.toFixed(2)} ₺`
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
