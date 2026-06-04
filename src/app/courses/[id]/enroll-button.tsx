"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { enrollInCourse } from "./actions";

export function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    const result = await enrollInCourse(courseId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
    }
    setLoading(false);
  }

  return (
    <Button
      className="w-full"
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? "Kaydediliyor..." : "Kursa Kaydol"}
    </Button>
  );
}
