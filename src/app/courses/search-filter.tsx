"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
    <form onSubmit={handleSearch} className="relative mb-10 max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <input
        placeholder="Kurs ara..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex h-10 w-full rounded-xl border border-input bg-background pl-11 pr-4 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(""); router.push("/courses"); }}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      )}
    </form>
  );
}
