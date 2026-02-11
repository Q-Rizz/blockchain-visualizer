"use client";

import { useState } from "react";
import { Pickaxe, Loader2 } from "lucide-react";

interface MiningFormProps {
  onMine: (data: string) => void;
  isMining: boolean;
}

export function MiningForm({ onMine, isMining }: MiningFormProps) {
  const [data, setData] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.trim() || isMining) return;
    onMine(data.trim());
    setData("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label
        htmlFor="block-data"
        className="text-xs font-medium text-muted-foreground"
      >
        Block Data
      </label>
      <input
        id="block-data"
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="e.g., Alice pays Bob 10 BTC"
        className="w-full rounded-xl border border-border/60 bg-muted/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] focus:bg-muted"
        disabled={isMining}
      />
      <button
        type="submit"
        disabled={!data.trim() || isMining}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-[0_4px_20px_rgba(139,92,246,0.35)] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:brightness-100 active:scale-[0.98]"
      >
        {isMining ? (
          <>
            <Loader2 className="h-4 w-4 animate-mining-spin" />
            <span>Mining…</span>
          </>
        ) : (
          <>
            <Pickaxe className="h-4 w-4" />
            <span>Mine Block</span>
          </>
        )}
      </button>
    </form>
  );
}
