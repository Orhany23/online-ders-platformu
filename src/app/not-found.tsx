import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-8xl font-bold gradient-text mb-4">404</div>
      <p className="text-xl text-muted-foreground mb-2">Sayfa bulunamadı</p>
      <p className="text-sm text-muted-foreground/60 mb-8">
        Aradığın sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
      >
        ← Ana Sayfaya Dön
      </Link>
    </div>
  );
}
