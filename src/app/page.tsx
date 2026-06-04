import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";

const features = [
  {
    icon: "✦",
    title: "Kayıtlı Dersler",
    desc: "İstediğin zaman izle, kendi hızında öğren. Tüm dersler kayıt altında.",
  },
  {
    icon: "◆",
    title: "Canlı Dersler",
    desc: "Eğitmenlerle birebir canlı dersler, anında soru sor, anında cevap al.",
  },
  {
    icon: "★",
    title: "Her Seviyeye Uygun",
    desc: "Başlangıçtan ileri seviyeye, herkes için dersler. Sana uygun olanı bul.",
  },
];

const testimonials = [
  {
    name: "Ayşe Yılmaz",
    role: "Yazılım Geliştirici",
    text: "Fiberan sayesinde kariyerime yeni bir yön verdim. Dersler çok kaliteli ve eğitmenler gerçekten alanında uzman.",
  },
  {
    name: "Mehmet Demir",
    role: "Üniversite Öğrencisi",
    text: "Okulda anlamadığım konuları burada tekrar izleyip pekiştiriyorum. Canlı dersler harika bir fırsat.",
  },
  {
    name: "Zeynep Kaya",
    role: "UX Tasarımcı",
    text: "Kendi hızımda öğrenebilmek en büyük avantaj. Herkese kesinlikle tavsiye ediyorum.",
  },
];

export default async function HomePage() {
  const [featuredCourses, totalCourses, totalStudents, totalInstructors] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      include: {
        instructor: { select: { name: true } },
        _count: { select: { lessons: true, enrollments: true } },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where: { published: true } }),
    prisma.enrollment.count(),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-orb w-[500px] h-[500px] bg-violet-600/20 -top-40 -right-40" />
          <div className="hero-orb w-[400px] h-[400px] bg-rose-600/15 -bottom-40 -left-40" />
          <div className="hero-orb w-[300px] h-[300px] bg-amber-600/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center py-24">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground mb-8 shadow-soft">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Yeni kayıtlı dersler her hafta ekleniyor
            </div>
          </div>
          <h1 className="animate-fade-in-up animate-fade-in-up-delay-1 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]">
            Online Derslerle
            <br />
            <span className="gradient-text">Kendini Geliştir</span>
          </h1>
          <p className="animate-fade-in-up animate-fade-in-up-delay-2 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Uzman eğitmenlerden canlı ve kayıtlı derslerle öğrenmeye başla.
            İstediğin zaman, istediğin yerden.
          </p>
          <div className="animate-fade-in-up animate-fade-in-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-8 py-3.5 text-base font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-2px] active:scale-[0.98]"
            >
              Kursları Keşfet
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/80 backdrop-blur-sm px-8 py-3.5 text-base font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-2px] active:scale-[0.98]"
            >
              Ücretsiz Başla
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up animate-fade-in-up-delay-4 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <p className="text-3xl md:text-4xl font-bold gradient-text">{totalCourses}+</p>
              <p className="text-sm text-muted-foreground mt-1">Kurs</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold gradient-text">{totalStudents}+</p>
              <p className="text-sm text-muted-foreground mt-1">Öğrenci</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold gradient-text">{totalInstructors}+</p>
              <p className="text-sm text-muted-foreground mt-1">Eğitmen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{totalCourses}+</p>
              <p className="text-sm text-muted-foreground mt-1">Yayındaki Kurs</p>
            </div>
            <div className="p-4">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{totalStudents}+</p>
              <p className="text-sm text-muted-foreground mt-1">Kayıtlı Öğrenci</p>
            </div>
            <div className="p-4">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{totalInstructors}+</p>
              <p className="text-sm text-muted-foreground mt-1">Uzman Eğitmen</p>
            </div>
            <div className="p-4">
              <p className="text-2xl md:text-3xl font-bold gradient-text">%98</p>
              <p className="text-sm text-muted-foreground mt-1">Memnuniyet Oranı</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Neden <span className="gradient-text">Fiberan</span>?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Öğrenme deneyimini bir üst seviyeye taşıyacak özellikler
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl border bg-card p-10 text-center card-hover shadow-soft"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-rose-500/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-primary">{f.icon}</span>
                </div>
                <h3 className="font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  Son Eklenen <span className="gradient-text">Kurslar</span>
                </h2>
                <p className="text-muted-foreground text-lg">
                  En güncel ders içerikleriyle öğrenmeye başla
                </p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-5 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] flex-shrink-0"
              >
                Tümünü Gör
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course, i) => (
                <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <CourseCard
                    id={course.id}
                    title={course.title}
                    image={course.image}
                    price={course.price}
                    instructorName={course.instructor.name}
                    lessonCount={course._count.lessons}
                    enrollmentCount={course._count.enrollments}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Öğrencilerimiz <span className="gradient-text">Ne Diyor?</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Binlerce öğrencimiz arasından sadece birkaçı
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="animate-fade-in-up testimonial-card rounded-2xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:translate-y-[-2px]"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-violet-600/10 via-background to-rose-600/10 border border-border/50 p-12 md:p-20 shadow-soft-lg relative overflow-hidden">
            <div className="hero-orb w-[300px] h-[300px] bg-violet-600/10 top-0 right-0" />
            <div className="hero-orb w-[200px] h-[200px] bg-rose-600/10 bottom-0 left-0" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Hemen <span className="gradient-text">Başla</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-lg">
                Binlerce öğrenciye katıl, kariyerini bir adım öne taşı.
                İlk dersin ücretsiz!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-8 py-3.5 text-base font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-2px] active:scale-[0.98]"
                >
                  Ücretsiz Kaydol
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-8 py-3.5 text-base font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-2px] active:scale-[0.98]"
                >
                  Kursları İncele
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
