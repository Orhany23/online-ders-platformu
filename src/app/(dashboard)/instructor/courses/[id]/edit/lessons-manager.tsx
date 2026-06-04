"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dersler ({lessons.length})</CardTitle>
        <Button size="sm" onClick={() => setShowForm(true)}>
          Ders Ekle
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {lessons.length === 0 && !showForm && (
          <p className="text-muted-foreground">Henüz ders eklenmemiş.</p>
        )}

        {lessons.map((lesson, i) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-3 rounded-lg border"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
              <div>
                <p className="font-medium">{lesson.title}</p>
                {lesson.duration && (
                  <p className="text-sm text-muted-foreground">{lesson.duration} dk</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => deleteLesson(lesson.id)}
            >
              Sil
            </Button>
          </div>
        ))}

        {showForm && (
          <form onSubmit={addLesson} className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Ders Başlığı</Label>
              <Input id="lesson-title" name="title" placeholder="Örn: Değişkenler ve Veri Tipleri" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-desc">Açıklama (isteğe bağlı)</Label>
              <Textarea id="lesson-desc" name="description" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-video">Video URL (isteğe bağlı)</Label>
              <Input id="lesson-video" name="videoUrl" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-duration">Süre (dk, isteğe bağlı)</Label>
              <Input id="lesson-duration" name="duration" type="number" min="1" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Ekleniyor..." : "Ekle"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                İptal
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
