# Değişiklik Günlüğü (CHANGELOG) — Fiberan

Her değişiklik burada kaydedilir. En yeni en üstte. Geri dönmek için: GitHub'da commit listesinden ilgili kodu bul → commit'i aç → "Revert".

---

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
