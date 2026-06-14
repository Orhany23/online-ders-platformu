"use client";

import { useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: { enrollments: number; courses: number };
};

const roleStyles: Record<string, string> = {
  ADMIN: "bg-destructive/10 text-destructive border-destructive/20",
  INSTRUCTOR: "bg-primary/10 text-primary border-primary/20",
  STUDENT: "bg-muted text-muted-foreground border-border",
};

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  INSTRUCTOR: "Eğitmen",
  STUDENT: "Öğrenci",
};

function RoleCell({ user }: { user: User }) {
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const changeRole = async (next: string) => {
    if (next === role) return;
    const prev = role;
    setRole(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(
        next === "INSTRUCTOR"
          ? `${user.name ?? user.email} artık Eğitmen`
          : `Rol güncellendi: ${roleLabels[next]}`
      );
    } catch {
      setRole(prev);
      toast.error("Rol değiştirilemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleStyles[role] ?? roleStyles.STUDENT}`}
      >
        {roleLabels[role] ?? "Öğrenci"}
      </span>
      <select
        value={role}
        disabled={saving}
        onChange={(e) => changeRole(e.target.value)}
        aria-label="Rol değiştir"
        className="text-xs rounded-md border border-border bg-card px-2 py-1 text-muted-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-50"
      >
        <option value="STUDENT">Öğrenci</option>
        <option value="INSTRUCTOR">Eğitmen</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>
  );
}

export function UsersTable({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");
  const filtered = users.filter(
    (u) =>
      (u.name ?? "").toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="İsim veya e-posta ara…"
        className="mb-4 w-full sm:max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60">
              <th className="text-left font-medium text-muted-foreground py-3 px-3">Ad</th>
              <th className="text-left font-medium text-muted-foreground py-3 px-3">E-posta</th>
              <th className="text-left font-medium text-muted-foreground py-3 px-3">Rol / Tanımla</th>
              <th className="text-left font-medium text-muted-foreground py-3 px-3">Katıldığı</th>
              <th className="text-left font-medium text-muted-foreground py-3 px-3">Kursları</th>
              <th className="text-left font-medium text-muted-foreground py-3 px-3">Kayıt</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-border/40 hover:bg-accent/40 transition-colors">
                <td className="font-medium py-3 px-3">{user.name ?? "-"}</td>
                <td className="py-3 px-3 text-muted-foreground">{user.email}</td>
                <td className="py-3 px-3"><RoleCell user={user} /></td>
                <td className="py-3 px-3">{user._count.enrollments}</td>
                <td className="py-3 px-3">{user._count.courses}</td>
                <td className="py-3 px-3 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  Eşleşen kullanıcı yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
