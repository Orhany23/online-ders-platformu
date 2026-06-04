import Link from "next/link";

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
    <Link href={`/courses/${id}`} className="group block">
      <div className="rounded-2xl border bg-card shadow-soft overflow-hidden card-hover h-full flex flex-col">
        <div className="relative overflow-hidden">
          {image ? (
            <div className="aspect-video overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-violet-600/20 via-primary/5 to-rose-600/20 flex items-center justify-center">
              <span className="text-4xl text-primary/20 font-bold select-none">✦</span>
            </div>
          )}
          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold shadow-soft border border-border/50">
              {price === 0 ? (
                <span className="text-emerald-600">Ücretsiz</span>
              ) : (
                <>{price.toFixed(2)} <span className="text-muted-foreground font-normal">₺</span></>
              )}
            </span>
          </div>
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-5 flex flex-col flex-1">
          {/* Instructor avatar + name */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {instructorName?.charAt(0)?.toUpperCase() ?? "E"}
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {instructorName ?? "Eğitmen"}
            </span>
          </div>

          <h3 className="font-semibold text-base leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Progress bar style stats */}
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                {lessonCount} ders
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                {enrollmentCount} öğrenci
              </span>
            </div>
            {/* Progress indicator */}
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-rose-500 transition-all duration-500"
                style={{ width: `${Math.min(100, enrollmentCount * 5)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
