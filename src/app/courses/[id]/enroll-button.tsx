"use client";

import { useState } from "react";
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
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium shadow-soft transition-all hover:shadow-soft-lg hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
          Kaydediliyor...
        </span>
      ) : (
        "Kursa Kaydol"
      )}
    </button>
  );
}
