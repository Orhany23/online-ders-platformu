import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const liveSession = await prisma.liveSession.findUnique({
    where: { id },
    include: { course: { select: { instructorId: true } } },
  });

  if (!liveSession) {
    return NextResponse.json({ error: "Canlı ders bulunamadı" }, { status: 404 });
  }

  if (liveSession.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  await prisma.liveSession.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
