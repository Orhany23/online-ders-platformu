import Link from "next/link";

export const metadata = { title: "Şifremi Unuttum | Fiberan" };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 shadow-soft-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 0h10.5a2.25 2.25 0 0 1 2.25 2.25v6.75a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-6.75a2.25 2.25 0 0 1 2.25-2.25Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Şifreni mi unuttun?</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Şifre sıfırlama şu an yöneticimiz tarafından yapılıyor. Kayıtlı
            e-posta adresinle bize ulaş, şifreni sıfırlayıp yeni şifreni sana
            iletelim.
          </p>
        </div>

        <a
          href="mailto:yasliOrhan26@gmail.com?subject=Şifre%20sıfırlama%20talebi"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
        >
          yasliOrhan26@gmail.com adresine yaz
        </a>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/login" className="font-medium text-primary hover:underline">
            ← Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </div>
  );
}
