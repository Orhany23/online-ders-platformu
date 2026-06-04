"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold mb-4">Bir hata oluştu</h1>
      <p className="text-muted-foreground mb-8">
        {error.message ?? "Beklenmeyen bir hata meydana geldi."}
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Tekrar Dene</Button>
        <Button variant="outline" asChild>
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </div>
  );
}
