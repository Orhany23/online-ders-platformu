"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kurs Bilgileri</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Kurs Başlığı</Label>
            <Input
              id="title"
              name="title"
              defaultValue={course.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={course.description}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Fiyat (₺)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={course.price}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Kapak Görseli (URL)</Label>
            <Input
              id="image"
              name="image"
              defaultValue={course.image ?? ""}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Kursu yayınla</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
