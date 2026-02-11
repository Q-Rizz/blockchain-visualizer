"use client";

import { Zap, Loader2 } from "lucide-react";

interface AutoMineProps {
  onAutoMine: () => void;
  isAutoMining: boolean;
  autoMineProgress: { current: number; total: number } | null;
}

export function AutoMine({
  onAutoMine,
  isAutoMining,
  autoMineProgress,
}: AutoMineProps) {
  const progress = autoMineProgress
    ? (autoMineProgress.current / autoMineProgress.total) * 100
    : 0;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-muted-foreground">
        Quick Demo
      </label>
      <button
        onClick={onAutoMine}
        disabled={isAutoMining}
        className="relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-accent/20 bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent transition-all duration-200 hover:bg-accent/10 hover:border-accent/30 hover:shadow-[0_4px_20px_rgba(99,102,241,0.2)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {/* Progress bar behind text */}
        {isAutoMining && (
          <div
            className="absolute inset-0 bg-accent/10 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        )}
        <span className="relative flex items-center gap-2">
          {isAutoMining ? (
            <>
              <Loader2 className="h-4 w-4 animate-mining-spin" />
              <span>
                Mining {autoMineProgress?.current}/{autoMineProgress?.total}…
              </span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              <span>Mine 3 Sample Blocks</span>
            </>
          )}
        </span>
      </button>
    </div>
  );
}
