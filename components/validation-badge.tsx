import { ShieldCheck, ShieldAlert } from "lucide-react";

export function ValidationBadge({ isValid }: { isValid: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 transition-all duration-500 ${
        isValid
          ? "border-success/30 bg-success/8 shadow-[0_0_20px_rgba(34,197,94,0.08)]"
          : "border-destructive/30 bg-destructive/8 shadow-[0_0_20px_rgba(239,68,68,0.08)]"
      }`}
      role="status"
      aria-live="polite"
    >
      {isValid ? (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
          <ShieldCheck className="h-4.5 w-4.5 text-success" />
        </div>
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
          <ShieldAlert className="h-4.5 w-4.5 text-destructive" />
        </div>
      )}
      <div>
        <p
          className={`text-sm font-bold leading-tight ${isValid ? "text-success" : "text-destructive"}`}
        >
          {isValid ? "Chain Valid" : "Chain Invalid"}
        </p>
        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
          {isValid
            ? "All blocks verified"
            : "Tampering detected"}
        </p>
      </div>
    </div>
  );
}
