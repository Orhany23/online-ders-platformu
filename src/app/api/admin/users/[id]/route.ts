import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};

  if ("role" in body) {
    if (!["STUDENT", "INSTRUCTOR", "ADMIN"].includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    data.role = body.role;
  }
  if ("branch" in body) data.branch = (body.branch || "").trim() || null;
  if ("teacherKind" in body) {
    data.teacherKind = ["DERS", "KOCLUK"].includes(body.teacherKind) ? body.teacherKind : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Güncellenecek alan yok" }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id }, data });

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      teacherKind: user.teacherKind,
    },
  });
}
