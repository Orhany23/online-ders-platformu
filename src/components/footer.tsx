import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3">🎓 Fiberan</h3>
            <p className="text-sm text-muted-foreground">
              Online ders alma ve verme platformu. Uzman eğitmenlerden canlı ve
              kayıtlı derslerle öğrenmeye başla.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Hızlı Linkler</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="/" className="block hover:text-primary">
                Ana Sayfa
              </Link>
              <Link href="/courses" className="block hover:text-primary">
                Kurslar
              </Link>
              <Link href="/login" className="block hover:text-primary">
                Giriş
              </Link>
              <Link href="/register" className="block hover:text-primary">
                Kayıt Ol
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">İletişim</h4>
            <p className="text-sm text-muted-foreground">
              Sorularınız için destek@fiberan.com adresinden bize ulaşın.
            </p>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Fiberan. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
