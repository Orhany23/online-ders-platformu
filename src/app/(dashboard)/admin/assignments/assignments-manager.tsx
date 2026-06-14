"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";

type Teacher = { id: string; name: string | null; email: string; branch: string | null; teacherKind: string | null };
type Student = { id: string; name: string | null; email: string };
type Assignment = { id: string; teacherId: string; studentId: string; student: Student };

const KIND_LABELS: Record<string, string> = { DERS: "Ders", KOCLUK: "Koçluk" };

export function AssignmentsManager({
  teachers,
  students,
  initialAssignments,
}: {
  teachers: Teacher[];
  students: Student[];
  initialAssignments: Assignment[];
}) {
  const [teacherList, setTeacherList] = useState(teachers);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selectedId, setSelectedId] = useState<string>(teachers[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = teacherList.find((t) => t.id === selectedId) ?? null;
  const [branch, setBranch] = useState(selected?.branch ?? "");
  const [kind, setKind] = useState(selected?.teacherKind ?? "");

  // öğretmen değişince form alanlarını senkronla
  const onSelectTeacher = (id: string) => {
    setSelectedId(id);
    const t = teacherList.find((x) => x.id === id);
    setBranch(t?.branch ?? "");
    setKind(t?.teacherKind ?? "");
    setQuery("");
  };

  const assignedStudents = useMemo(
    () => assignments.filter((a) => a.teacherId === selectedId),
    [assignments, selectedId]
  );
  const assignedIds = new Set(assignedStudents.map((a) => a.studentId));
  const available = students.filter(
    (s) =>
      !assignedIds.has(s.id) &&
      ((s.name ?? "").toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase()))
  );

  const saveBranch = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch, teacherKind: kind || null }),
      });
      if (!res.ok) throw new Error();
      setTeacherList((list) =>
        list.map((t) => (t.id === selected.id ? { ...t, branch: branch || null, teacherKind: kind || null } : t))
      );
      toast.success("Branş kaydedildi.");
    } catch {
      toast.error("Kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  };

  const assign = async (studentId: string) => {
    if (!selected) return;
    try {
      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: selected.id, studentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setAssignments((a) => [json.assignment, ...a]);
      toast.success("Öğrenci atandı.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Atanamadı.");
    }
  };

  const unassign = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/assignments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAssignments((a) => a.filter((x) => x.id !== id));
      toast.success("Eşleştirme kaldırıldı.");
    } catch {
      toast.error("Kaldırılamadı.");
    }
  };

  if (teachers.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground">
        Henüz öğretmen (Eğitmen) yok. Önce <strong>Kullanıcılar</strong> bölümünden bir kişiyi Eğitmen yap, sonra burada eşleştir.
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-6">
      {/* Öğretmen listesi */}
      <aside className="glass-card rounded-2xl p-3 h-fit">
        <p className="text-xs font-medium text-muted-foreground px-2 py-2">Öğretmenler</p>
        <div className="space-y-1">
          {teacherList.map((t) => {
            const count = assignments.filter((a) => a.teacherId === t.id).length;
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTeacher(t.id)}
                className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                <span className="block text-sm font-medium truncate">{t.name ?? t.email}</span>
                <span className={`block text-xs truncate ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {t.branch || "Branş belirtilmedi"}
                  {t.teacherKind ? ` · ${KIND_LABELS[t.teacherKind]}` : ""} · {count} öğrenci
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Seçili öğretmen paneli */}
      <section className="space-y-6">
        {/* Branş */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Branş bilgisi</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="Branş (ör. Matematik, YKS Rehberliği)"
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            >
              <option value="">Tür seç</option>
              <option value="DERS">Ders</option>
              <option value="KOCLUK">Koçluk</option>
            </select>
            <button
              onClick={saveBranch}
              disabled={busy}
              className="rounded-lg bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              Kaydet
            </button>
          </div>
        </div>

        {/* Atanmış öğrenciler */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">
            Atanmış öğrenciler <span className="text-muted-foreground font-normal">({assignedStudents.length})</span>
          </h3>
          {assignedStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bu öğretmene henüz öğrenci atanmadı.</p>
          ) : (
            <div className="space-y-2">
              {assignedStudents.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5">
                  <div className="min-w-0">
                    <span className="block text-sm font-medium truncate">{a.student.name ?? "-"}</span>
                    <span className="block text-xs text-muted-foreground truncate">{a.student.email}</span>
                  </div>
                  <button
                    onClick={() => unassign(a.id)}
                    className="text-xs rounded-lg border border-destructive/30 text-destructive px-3 py-1.5 hover:bg-destructive/10"
                  >
                    Kaldır
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Öğrenci ekle */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Öğrenci ata</h3>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Öğrenci ara (isim veya e-posta)…"
            className="mb-3 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          {available.length === 0 ? (
            <p className="text-sm text-muted-foreground">Eklenecek uygun öğrenci yok.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {available.slice(0, 40).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5">
                  <div className="min-w-0">
                    <span className="block text-sm font-medium truncate">{s.name ?? "-"}</span>
                    <span className="block text-xs text-muted-foreground truncate">{s.email}</span>
                  </div>
                  <button
                    onClick={() => assign(s.id)}
                    className="text-xs rounded-lg bg-primary text-primary-foreground px-3 py-1.5 hover:opacity-90"
                  >
                    Ata
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
