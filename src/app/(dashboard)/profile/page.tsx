"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
        else router.push("/login");
      });
  }, [router]);

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.get("name") }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Bir hata oluştu");
      setLoading(false);
      return;
    }

    toast.success("Profil güncellendi!");
    router.refresh();
    setLoading(false);
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      setPasswordLoading(false);
      return;
    }

    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Bir hata oluştu");
      setPasswordLoading(false);
      return;
    }

    toast.success("Şifre değiştirildi!");
    (e.target as HTMLFormElement).reset();
    setPasswordLoading(false);
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center py-20">
          <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      </div>
    );
  }

  const inputClass = "flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold">
        <span className="gradient-text">Profil</span>
      </h1>

      <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft space-y-6">
        <div>
          <h2 className="text-lg font-bold">Profili Düzenle</h2>
          <p className="text-sm text-muted-foreground">
            Adını ve iletişim bilgilerini güncelle
          </p>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Ad Soyad</label>
            <input
              id="name"
              name="name"
              defaultValue={user.name ?? ""}
              required
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">E-posta</label>
            <input
              id="email"
              value={user.email}
              disabled
              className={`${inputClass} bg-muted/50`}
            />
            <p className="text-xs text-muted-foreground">
              E-posta adresi değiştirilemez.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Kaydediliyor...
              </span>
            ) : (
              "Değişiklikleri Kaydet"
            )}
          </button>
        </form>
      </div>

      <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft space-y-6">
        <div>
          <h2 className="text-lg font-bold">Şifre Değiştir</h2>
          <p className="text-sm text-muted-foreground">
            Hesap güvenliğin için şifreni düzenli olarak değiştir
          </p>
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium">Mevcut Şifre</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">Yeni Şifre</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={6}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Yeni Şifre (Tekrar)</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {passwordLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                Değiştiriliyor...
              </span>
            ) : (
              "Şifreyi Değiştir"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
