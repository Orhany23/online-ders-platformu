import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || !user.password)
    return NextResponse.json({ error: "Cannot change password" }, { status: 400 });

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid)
    return NextResponse.json(
      { error: "Current password is wrong" },
      { status: 400 }
    );

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ success: true });
}
