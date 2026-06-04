"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const inputClass = "flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Canlı Dersler ({sessions.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Canlı Ders Ekle
        </button>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 && !showForm && (
          <p className="text-muted-foreground text-sm py-4">Henüz canlı ders eklenmemiş.</p>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/30 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm">{session.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(session.date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              {session.meetingLink && (
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Link
                </a>
              )}
              <button
                onClick={() => deleteSession(session.id)}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Sil
              </button>
            </div>
          </div>
        ))}

        {showForm && (
          <form onSubmit={addSession} className="space-y-4 p-5 rounded-xl border border-border/50 bg-muted/20">
            <div className="space-y-2">
              <label htmlFor="ls-title" className="text-sm font-medium">Ders Başlığı</label>
              <input id="ls-title" name="title" placeholder="Örn: Hafta 1 - Canlı Ders" required className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="ls-desc" className="text-sm font-medium">Açıklama (isteğe bağlı)</label>
              <input id="ls-desc" name="description" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="ls-date" className="text-sm font-medium">Tarih ve Saat</label>
              <input id="ls-date" name="date" type="datetime-local" required className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="ls-link" className="text-sm font-medium">Toplantı Linki (Zoom/Meet)</label>
              <input id="ls-link" name="meetingLink" placeholder="https://zoom.us/j/..." className={inputClass} />
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
