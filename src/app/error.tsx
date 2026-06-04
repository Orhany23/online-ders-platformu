"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-6xl font-bold gradient-text mb-4">Hata</div>
      <h1 className="text-xl font-semibold mb-2">Bir şeyler yanlış gitti</h1>
      <p className="text-sm text-muted-foreground/60 mb-8 max-w-md text-center">
        {error.message ?? "Beklenmeyen bir hata meydana geldi."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px]"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
