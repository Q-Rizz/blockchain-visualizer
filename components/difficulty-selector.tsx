interface DifficultySelectorProps {
  difficulty: number;
  onChange: (d: number) => void;
}

export function DifficultySelector({
  difficulty,
  onChange,
}: DifficultySelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-muted-foreground">
        Mining Difficulty
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold font-mono transition-all duration-200 ${
              difficulty === d
                ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(139,92,246,0.35)] ring-2 ring-primary/30"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground ring-1 ring-border/50"
            }`}
            aria-label={`Set difficulty to ${d}`}
            aria-pressed={difficulty === d}
          >
            {d}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Hash must start with{" "}
        <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary">
          {"0".repeat(difficulty)}
        </code>
      </p>
    </div>
  );
}
