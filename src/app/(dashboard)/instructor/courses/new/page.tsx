"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string) || 0,
        image: formData.get("image") || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Bir hata oluştu");
      setLoading(false);
      return;
    }

    toast.success("Kurs oluşturuldu!");
    router.push("/instructor/courses");
    router.refresh();
  }

  const inputClass = "flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
  const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const btnOutline = "inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] active:scale-[0.98]";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="glass rounded-2xl border border-border/50 p-8 shadow-soft-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Yeni Kurs Oluştur</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kurs bilgilerini gir ve öğrencilerle paylaşmaya başla
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Kurs Başlığı</label>
            <input
              id="title"
              name="title"
              placeholder="Örn: Python ile Programlamaya Giriş"
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Açıklama</label>
            <textarea
              id="description"
              name="description"
              placeholder="Kurs içeriğini kısaca anlat..."
              rows={4}
              required
              className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">Fiyat (&#x20BA;)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue="0"
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">
              0 bırakırsanız kurs ücretsiz olur
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">Kapak Görseli (URL)</label>
            <input
              id="image"
              name="image"
              placeholder="https://ornek.com/gorsel.jpg"
              className={inputClass}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={loading} className={btnPrimary}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Oluşturuluyor...
                </span>
              ) : (
                "Kursu Oluştur"
              )}
            </button>
            <button type="button" onClick={() => router.back()} className={btnOutline}>
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
