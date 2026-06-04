"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: { enrollments: number; courses: number };
};

export function UsersTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ad</TableHead>
          <TableHead>E-posta</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Kayıt</TableHead>
          <TableHead>Kurslar</TableHead>
          <TableHead>Katılma</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name ?? "-"}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={
                  user.role === "ADMIN"
                    ? "destructive"
                    : user.role === "INSTRUCTOR"
                    ? "default"
                    : "secondary"
                }
              >
                {user.role === "ADMIN"
                  ? "Admin"
                  : user.role === "INSTRUCTOR"
                  ? "Eğitmen"
                  : "Öğrenci"}
              </Badge>
            </TableCell>
            <TableCell>{user._count.enrollments}</TableCell>
            <TableCell>{user._count.courses}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("tr-TR")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
