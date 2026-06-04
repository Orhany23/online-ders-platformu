const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed verisi ekleniyor...\n");

  // Mevcut veriyi temizle (sıralama önemli - foreign key'ler)
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("  Mevcut veri temizlendi.");

  // Şifreleri hashle
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const testPassword = await bcrypt.hash("Test123!", 10);

  // Kullanıcılar
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@fiberan.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`  ✅ Admin: admin@fiberan.com / Admin123!`);

  const instructor1 = await prisma.user.create({
    data: {
      name: "Ahmet Yılmaz",
      email: "hoca@test.com",
      password: testPassword,
      role: "INSTRUCTOR",
    },
  });
  console.log(`  ✅ Eğitmen: hoca@test.com / Test123!`);

  const instructor2 = await prisma.user.create({
    data: {
      name: "Ayşe Demir",
      email: "ayse@test.com",
      password: testPassword,
      role: "INSTRUCTOR",
    },
  });
  console.log(`  ✅ Eğitmen: ayse@test.com / Test123!`);

  const student = await prisma.user.create({
    data: {
      name: "Mehmet Öğrenci",
      email: "ogrenci@test.com",
      password: testPassword,
      role: "STUDENT",
    },
  });
  console.log(`  ✅ Öğrenci: ogrenci@test.com / Test123!`);

  // Kurslar
  const course1 = await prisma.course.create({
    data: {
      title: "Modern Web Geliştirme",
      description:
        "HTML, CSS, JavaScript ve React ile modern web uygulamaları geliştirmeyi öğrenin. Sıfırdan ileri seviyeye kapsamlı bir bootcamp.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      price: 199,
      published: true,
      instructorId: instructor1.id,
      lessons: {
        create: [
          {
            title: "Web Geliştirmeye Giriş",
            description: "İnternet nasıl çalışır, web teknolojilerine genel bakış",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 45,
            order: 1,
          },
          {
            title: "HTML5 ile Sayfa Yapısı",
            description: "Semantik HTML etiketleri, formlar, tablolar",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 50,
            order: 2,
          },
          {
            title: "CSS3 ile Stil Verme",
            description: "Flexbox, Grid, responsive tasarım, animasyonlar",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 60,
            order: 3,
          },
          {
            title: "JavaScript Temelleri",
            description: "Değişkenler, fonksiyonlar, DOM manipülasyonu, event handling",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 75,
            order: 4,
          },
        ],
      },
      liveSessions: {
        create: [
          {
            title: "Canlı Q&A - Web Geliştirme",
            description: "Haftalık soru-cevap oturumu, proje incelemesi",
            date: new Date("2026-06-15T20:00:00Z"),
            meetingLink: "https://meet.google.com/abc-defg-hij",
            instructorId: instructor1.id,
          },
        ],
      },
    },
    include: {
      lessons: true,
      liveSessions: true,
    },
  });
  console.log(`  ✅ Kurs: "Modern Web Geliştirme" - ${course1.lessons.length} ders, 1 canlı oturum`);

  const course2 = await prisma.course.create({
    data: {
      title: "Python ile Veri Bilimi",
      description:
        "Python programlama dilini kullanarak veri analizi, görselleştirme ve makine öğrenmesine giriş yapın.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      price: 249,
      published: true,
      instructorId: instructor2.id,
      lessons: {
        create: [
          {
            title: "Python'a Giriş",
            description: "Python kurulumu, temel veri tipleri, değişkenler",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 40,
            order: 1,
          },
          {
            title: "Veri Yapıları ve Fonksiyonlar",
            description: "Listeler, tuple'lar, sözlükler, fonksiyon tanımlama",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 55,
            order: 2,
          },
          {
            title: "Pandas ile Veri Analizi",
            description: "DataFrame'ler, veri temizleme, grup işlemleri",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 65,
            order: 3,
          },
        ],
      },
      liveSessions: {
        create: [
          {
            title: "Canlı Kodlama - Veri Analizi Projesi",
            description: "Gerçek bir veri seti üzerinde birlikte çalışacağız",
            date: new Date("2026-06-18T19:00:00Z"),
            meetingLink: "https://zoom.us/j/123456789",
            instructorId: instructor2.id,
          },
        ],
      },
    },
    include: {
      lessons: true,
      liveSessions: true,
    },
  });
  console.log(`  ✅ Kurs: "Python ile Veri Bilimi" - ${course2.lessons.length} ders, 1 canlı oturum`);

  const course3 = await prisma.course.create({
    data: {
      title: "Flutter ile Mobil Uygulama",
      description:
        "Tek kod tabanı ile iOS ve Android için modern mobil uygulamalar geliştirin. Dart dilinden başlayın, gerçek uygulamalara geçin.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      price: 299,
      published: false,
      instructorId: instructor1.id,
      lessons: {
        create: [
          {
            title: "Dart Diline Giriş",
            description: "Dart kurulumu, temel sözdizimi, tip sistemi",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 50,
            order: 1,
          },
          {
            title: "Flutter Widget'ları",
            description: "StatelessWidget, StatefulWidget, temel widget'lar",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 60,
            order: 2,
          },
          {
            title: "Navigasyon ve Routing",
            description: "Sayfalar arası geçiş, parametre aktarımı",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: 45,
            order: 3,
          },
        ],
      },
    },
    include: {
      lessons: true,
    },
  });
  console.log(`  ✅ Kurs: "Flutter ile Mobil Uygulama" - ${course3.lessons.length} ders (yayında değil)`);

  // Kayıtlar
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
    },
  });
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course2.id,
    },
  });
  console.log(`  ✅ Öğrenci 2 kursa kaydedildi`);

  console.log("\n🌱 Seed verisi başarıyla eklendi!");
  console.log("──────────────────────────────");
  console.log("👤 Admin:      admin@fiberan.com / Admin123!");
  console.log("👨‍🏫 Eğitmen:    hoca@test.com / Test123!");
  console.log("👩‍🏫 Eğitmen:    ayse@test.com / Test123!");
  console.log("👨‍🎓 Öğrenci:   ogrenci@test.com / Test123!");
  console.log("──────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
