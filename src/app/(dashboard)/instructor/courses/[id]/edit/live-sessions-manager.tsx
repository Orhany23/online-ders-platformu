"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type LiveSession = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  meetingLink: string | null;
};

export function LiveSessionsManager({
  courseId,
  sessions: initialSessions,
}: {
  courseId: string;
  sessions: LiveSession[];
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState<LiveSession[]>(initialSessions);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function addSession(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/livesessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        date: new Date(formData.get("date") as string).toISOString(),
        meetingLink: formData.get("meetingLink") || null,
        courseId,
      }),
    });

    if (!res.ok) {
      toast.error("Canlı ders eklenirken hata oluştu");
      setLoading(false);
      return;
    }

    const session = await res.json();
    setSessions([...sessions, session]);
    setShowForm(false);
    toast.success("Canlı ders eklendi!");
    router.refresh();
    setLoading(false);
  }

  async function deleteSession(sessionId: string) {
    if (!confirm("Bu canlı dersi silmek istediğine emin misin?")) return;

    const res = await fetch(`/api/livesessions/${sessionId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Silinirken hata oluştu");
      return;
    }

    setSessions(sessions.filter((s) => s.id !== sessionId));
    toast.success("Canlı ders silindi!");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Canlı Dersler ({sessions.length})</CardTitle>
        <Button size="sm" onClick={() => setShowForm(true)}>
          Canlı Ders Ekle
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length === 0 && !showForm && (
          <p className="text-muted-foreground">Henüz canlı ders eklenmemiş.</p>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-3 rounded-lg border"
          >
            <div>
              <p className="font-medium">{session.title}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(session.date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {session.meetingLink && (
                <Button variant="outline" size="sm" asChild>
                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => deleteSession(session.id)}
              >
                Sil
              </Button>
            </div>
          </div>
        ))}

        {showForm && (
          <form onSubmit={addSession} className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="ls-title">Ders Başlığı</Label>
              <Input id="ls-title" name="title" placeholder="Örn: Hafta 1 - Canlı Ders" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ls-desc">Açıklama (isteğe bağlı)</Label>
              <Input id="ls-desc" name="description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ls-date">Tarih ve Saat</Label>
              <Input id="ls-date" name="date" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ls-link">Toplantı Linki (Zoom/Meet)</Label>
              <Input id="ls-link" name="meetingLink" placeholder="https://zoom.us/j/..." />
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
