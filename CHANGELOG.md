# Değişiklik Günlüğü (CHANGELOG) — Fiberan

Her değişiklik burada kaydedilir. En yeni en üstte. Geri dönmek için: GitHub'da commit listesinden ilgili kodu bul → commit'i aç → "Revert".

---

## [v4] — 14 Haziran 2026 — Şifre sıfırlama + yönetici linki
Ne değişti:
- Admin panelinde her kullanıcı için "Şifre sıfırla" butonu: yönetici yeni şifre belirler (kendi dahil). E-posta altyapısı gerekmez.
- Login sayfasına "Şifremi unuttum?" linki + /forgot-password sayfası (şu an admin'e yönlendirir).
- Footer'a sade "Yönetici" linki (/admin) eklendi.
Dosyalar: src/app/api/admin/users/[id]/password/route.ts, src/app/(dashboard)/admin/users-table.tsx, src/app/(auth)/login/page.tsx, src/app/(auth)/forgot-password/page.tsx, src/components/footer.tsx
Not: v1-v3'ten bağımsız (veritabanı değişikliği gerektirmez), ayrı da uygulanabilir.
Commit: bu commit

## [v3] — 14 Haziran 2026 — Eşleştirmenin iki tarafa yansıması
Ne değişti:
- Öğrenci panelinde (/dashboard) "Öğretmenim / Koçum" bölümü: öğrenci kendisine atanan öğretmen(ler)i, branşı ve türüyle görür.
- Öğretmen panelinde yeni "Öğrencilerim" sayfası (/instructor/students): öğretmen kendisine atanan öğrencileri görür. Navbar'a link eklendi.
Dosyalar: src/app/(dashboard)/dashboard/page.tsx, src/app/(dashboard)/instructor/students/page.tsx, src/components/navbar.tsx
Not: v3, v2'deki eşleştirme modeline bağlıdır; v1+v2 deploy olduktan SONRA uygulanmalı.
Commit: bu commit

## [v2] — 14 Haziran 2026 — Öğrenci–öğretmen eşleştirme altyapısı
Ne değişti:
- Öğretmene branş + tür (Ders / Koçluk) alanları eklendi.
- Yeni Assignment (eşleştirme) modeli: admin bir öğrenciyi bir öğretmene atar.
- Admin paneline "Öğrenci–Öğretmen Eşleştirme" ekranı: öğretmen seç → branşını belirle → öğrencileri ata/kaldır.
- Eşleştirme API uçları (/api/admin/assignments).
- build script'e "prisma db push" eklendi (yeni tablo deploy'da otomatik oluşsun).
Dosyalar: prisma/schema.prisma, package.json, src/app/api/admin/users/[id]/route.ts, src/app/api/admin/assignments/route.ts, src/app/api/admin/assignments/[id]/route.ts, src/app/(dashboard)/admin/assignments/page.tsx, src/app/(dashboard)/admin/assignments/assignments-manager.tsx, src/app/(dashboard)/admin/page.tsx
Commit: bu commit

## [v1] — 14 Haziran 2026 — Sade profesyonel redesign + hoca tanımlama
Ne değişti:
- Tasarım sistemi sadeleştirildi (globals.css): rainbow gradient/glassmorphism/orb kaldırıldı, nötr+indigo profesyonel sistem, dark mode.
- Admin kullanıcı tablosu etkileşimli: rol/eğitmen tanımlama + arama.
Dosyalar: src/app/globals.css, src/app/(dashboard)/admin/users-table.tsx
Commit: 663a28c için ayrı (push edilince kod yazılır)
