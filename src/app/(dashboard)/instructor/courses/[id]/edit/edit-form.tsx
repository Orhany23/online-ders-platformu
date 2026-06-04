"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
  published: boolean;
};

export function EditCourseForm({ course }: { course: Course }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(course.published);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/courses/${course.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string) || 0,
        image: formData.get("image") || null,
        published,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Bir hata oluştu");
      setLoading(false);
      return;
    }

    toast.success("Kurs güncellendi!");
    router.refresh();
    setLoading(false);
  }

  const inputClass = "flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
      <h2 className="text-lg font-bold mb-6">Kurs Bilgileri</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Kurs Başlığı</label>
          <input
            id="title"
            name="title"
            defaultValue={course.title}
            required
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Açıklama</label>
          <textarea
            id="description"
            name="description"
            defaultValue={course.description}
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
            defaultValue={course.price}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-medium">Kapak Görseli (URL)</label>
          <input
            id="image"
            name="image"
            defaultValue={course.image ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={() => setPublished(!published)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              published ? "bg-primary" : "bg-muted"
            }`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              published ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
          <label htmlFor="published" className="text-sm font-medium cursor-pointer" onClick={() => setPublished(!published)}>
            Kursu yayınla
          </label>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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
        </div>
      </form>
    </div>
  );
}
