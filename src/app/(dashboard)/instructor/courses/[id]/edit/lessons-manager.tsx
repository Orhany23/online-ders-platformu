"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;
  order: number;
};

export function LessonsManager({
  courseId,
  lessons: initialLessons,
}: {
  courseId: string;
  lessons: Lesson[];
}) {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function addLesson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        videoUrl: formData.get("videoUrl") || null,
        duration: parseInt(formData.get("duration") as string) || null,
        order: lessons.length + 1,
        courseId,
      }),
    });

    if (!res.ok) {
      toast.error("Ders eklenirken hata oluştu");
      setLoading(false);
      return;
    }

    const lesson = await res.json();
    setLessons([...lessons, lesson]);
    setShowForm(false);
    toast.success("Ders eklendi!");
    router.refresh();
    setLoading(false);
  }

  async function deleteLesson(lessonId: string) {
    if (!confirm("Bu dersi silmek istediğine emin misin?")) return;

    const res = await fetch(`/api/lessons/${lessonId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Ders silinirken hata oluştu");
      return;
    }

    setLessons(lessons.filter((l) => l.id !== lessonId));
    toast.success("Ders silindi!");
    router.refresh();
  }

  const inputClass = "flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Dersler ({lessons.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ders Ekle
        </button>
      </div>

      <div className="space-y-3">
        {lessons.length === 0 && !showForm && (
          <p className="text-muted-foreground text-sm py-4">Henüz ders eklenmemiş.</p>
        )}

        {lessons.map((lesson, i) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/30 transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{lesson.title}</p>
                {lesson.duration && (
                  <p className="text-xs text-muted-foreground">{lesson.duration} dk</p>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteLesson(lesson.id)}
              className="flex-shrink-0 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Sil
            </button>
          </div>
        ))}

        {showForm && (
          <form onSubmit={addLesson} className="space-y-4 p-5 rounded-xl border border-border/50 bg-muted/20">
            <div className="space-y-2">
              <label htmlFor="lesson-title" className="text-sm font-medium">Ders Başlığı</label>
              <input id="lesson-title" name="title" placeholder="Örn: Değişkenler ve Veri Tipleri" required className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="lesson-desc" className="text-sm font-medium">Açıklama (isteğe bağlı)</label>
              <textarea id="lesson-desc" name="description" rows={2} className="flex min-h-[60px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y" />
            </div>
            <div className="space-y-2">
              <label htmlFor="lesson-video" className="text-sm font-medium">Video URL (isteğe bağlı)</label>
              <input id="lesson-video" name="videoUrl" placeholder="https://..." className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="lesson-duration" className="text-sm font-medium">Süre (dk, isteğe bağlı)</label>
              <input id="lesson-duration" name="duration" type="number" min="1" className={inputClass} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
                {loading ? "Ekleniyor..." : "Ekle"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] active:scale-[0.98]">
                İptal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
