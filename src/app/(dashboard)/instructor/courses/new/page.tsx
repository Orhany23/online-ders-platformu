"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Kurs Oluştur</CardTitle>
          <CardDescription>
            Kurs bilgilerini gir ve öğrencilerle paylaşmaya başla
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Kurs Başlığı</Label>
              <Input
                id="title"
                name="title"
                placeholder="Örn: Python ile Programlamaya Giriş"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Kurs içeriğini kısaca anlat..."
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
                defaultValue="0"
              />
              <p className="text-xs text-muted-foreground">
                0 bırakırsanız kurs ücretsiz olur
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Kapak Görseli (URL)</Label>
              <Input
                id="image"
                name="image"
                placeholder="https://ornek.com/gorsel.jpg"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Oluşturuluyor..." : "Kursu Oluştur"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
