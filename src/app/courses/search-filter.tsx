"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/courses?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-md">
      <Input
        placeholder="Kurs ara..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit">Ara</Button>
    </form>
  );
}
