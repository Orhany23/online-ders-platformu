"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Bir hata oluştu");
      setLoading(false);
      return;
    }

    toast.success("Hesap oluşturuldu! Giriş yapabilirsin.");
    router.push("/login");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md glass rounded-2xl border border-border/50 p-8 shadow-soft-lg">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-1">
            <span className="gradient-text">Kayıt Ol</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Yeni bir hesap oluştur ve derslere katıl
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Ad Soyad
            </label>
            <input
              id="name"
              name="name"
              placeholder="Adın Soyadın"
              required
              className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@email.com"
              required
              className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              minLength={6}
              required
              className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Hesap Türü
            </label>
            <select
              id="role"
              name="role"
              className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              <option value="STUDENT">Öğrenci</option>
              <option value="INSTRUCTOR">Eğitmen</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Kaydediliyor...
              </span>
            ) : (
              "Kayıt Ol"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
