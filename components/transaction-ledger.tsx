import type { BlockData } from "@/lib/blockchain";
import { ScrollText, ArrowRight } from "lucide-react";

export function TransactionLedger({ chain }: { chain: BlockData[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Transaction Ledger
        </h3>
        {chain.length > 1 && (
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary ring-1 ring-primary/20">
            {chain.length - 1}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 rounded-xl border border-border/40 bg-muted/30 p-3 max-h-48 overflow-y-auto">
        {chain.length <= 1 ? (
          <p className="text-xs text-muted-foreground/60 italic text-center py-3">
            No transactions yet. Mine a block to get started.
          </p>
        ) : (
          chain.slice(1).map((block) => (
            <div
              key={block.index}
              className="flex items-center gap-2.5 py-2 border-b border-border/20 last:border-0 group"
            >
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold font-mono text-primary">
                {block.index}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
              <span className="text-xs text-foreground/90 group-hover:text-foreground transition-colors">
                {block.data}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
