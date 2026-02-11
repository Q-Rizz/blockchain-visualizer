export function ChainLink({ isValid }: { isValid: boolean }) {
  return (
    <div className="flex shrink-0 items-center justify-center py-1">
      <div className="flex flex-col items-center gap-0">
        <div
          className={`h-5 w-0.5 rounded-full ${isValid ? "bg-primary/30" : "bg-destructive/30"}`}
        />
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
            isValid
              ? "border-primary/30 bg-primary/5"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className={isValid ? "text-primary" : "text-destructive"}
            aria-hidden="true"
          >
            <path
              d="M6 0 L6 3 L2 3 L6 12 L6 9 L10 9 Z"
              fill="currentColor"
              opacity="0.7"
            />
          </svg>
        </div>
        <div
          className={`h-5 w-0.5 rounded-full ${isValid ? "bg-primary/30" : "bg-destructive/30"}`}
        />
      </div>
    </div>
  );
}
