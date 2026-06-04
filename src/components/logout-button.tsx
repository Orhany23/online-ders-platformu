"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="w-full text-left"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Çıkış Yap
    </button>
  );
}
