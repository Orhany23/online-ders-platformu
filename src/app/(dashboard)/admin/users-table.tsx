"use client";

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

export function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left font-medium text-muted-foreground py-3 px-3">Ad</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-3">E-posta</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-3">Rol</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-3">Kayıt</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-3">Kurslar</th>
            <th className="text-left font-medium text-muted-foreground py-3 px-3">Katılma</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border/25 hover:bg-accent/30 transition-colors">
              <td className="font-medium py-3 px-3">{user.name ?? "-"}</td>
              <td className="py-3 px-3 text-muted-foreground">{user.email}</td>
              <td className="py-3 px-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleStyles[user.role] ?? roleStyles.STUDENT}`}>
                  {roleLabels[user.role] ?? "Öğrenci"}
                </span>
              </td>
              <td className="py-3 px-3">{user._count.enrollments}</td>
              <td className="py-3 px-3">{user._count.courses}</td>
              <td className="py-3 px-3 text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("tr-TR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
