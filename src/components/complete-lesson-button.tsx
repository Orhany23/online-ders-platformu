"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CompleteLessonButton({
  lessonId,
  courseId,
  initiallyCompleted,
}: {
  lessonId: string;
  courseId: string;
  initiallyCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, courseId }),
    });

    if (res.ok) {
      setCompleted(true);
      toast.success("Ders tamamlandı!");
    } else {
      toast.error("Bir hata oluştu");
    }
    setLoading(false);
  }

  return (
    <Button
      onClick={handleClick}
      disabled={completed || loading}
      variant={completed ? "outline" : "default"}
    >
      {completed ? "✅ Tamamlandı" : loading ? "İşleniyor..." : "Dersi Tamamla"}
    </Button>
  );
}
