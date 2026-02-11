"use client";

import { useState, useCallback } from "react";
import {
  createGenesisBlock,
  mineBlock,
  isChainValid,
  getInvalidBlockIndices,
  calculateHash,
  type BlockData,
} from "@/lib/blockchain";
import { BlockCard } from "@/components/block-card";
import { ChainLink } from "@/components/chain-link";
import { ValidationBadge } from "@/components/validation-badge";
import { DifficultySelector } from "@/components/difficulty-selector";
import { MiningForm } from "@/components/mining-form";
import { TransactionLedger } from "@/components/transaction-ledger";
import { AutoMine } from "@/components/auto-mine";
import { Blocks, BookOpen, Pickaxe, Link, ShieldAlert } from "lucide-react";

const SAMPLE_TRANSACTIONS = [
  "Alice pays Bob 10 BTC",
  "Bob pays Charlie 5 BTC",
  "Charlie pays Dave 3 BTC",
];

export default function Home() {
  const [chain, setChain] = useState<BlockData[]>([createGenesisBlock()]);
  const [difficulty, setDifficulty] = useState(2);
  const [isMining, setIsMining] = useState(false);
  const [isAutoMining, setIsAutoMining] = useState(false);
  const [autoMineProgress, setAutoMineProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const valid = isChainValid(chain);
  const invalidIndices = getInvalidBlockIndices(chain);

  const handleMine = useCallback(
    (data: string) => {
      setIsMining(true);
      setTimeout(() => {
        const latestBlock = chain[chain.length - 1];
        const newBlock = mineBlock(
          chain.length,
          data,
          latestBlock.hash,
          difficulty
        );
        setChain((prev) => [...prev, newBlock]);
        setIsMining(false);
      }, 50);
    },
    [chain, difficulty]
  );

  const handleEdit = useCallback(
    (index: number, newData: string) => {
      setChain((prev) => {
        const updated = [...prev];
        const block = { ...updated[index] };
        block.data = newData;
        block.hash = calculateHash(
          block.index,
          block.previousHash,
          block.timestamp,
          block.data,
          block.nonce
        );
        updated[index] = block;
        return updated;
      });
    },
    []
  );

  const handleAutoMine = useCallback(() => {
    setIsAutoMining(true);
    setAutoMineProgress({ current: 0, total: SAMPLE_TRANSACTIONS.length });

    let currentChain = [...chain];
    let step = 0;

    const mineNext = () => {
      if (step >= SAMPLE_TRANSACTIONS.length) {
        setIsAutoMining(false);
        setAutoMineProgress(null);
        return;
      }

      setAutoMineProgress({
        current: step + 1,
        total: SAMPLE_TRANSACTIONS.length,
      });

      setTimeout(() => {
        const latestBlock = currentChain[currentChain.length - 1];
        const newBlock = mineBlock(
          currentChain.length,
          SAMPLE_TRANSACTIONS[step],
          latestBlock.hash,
          difficulty
        );
        currentChain = [...currentChain, newBlock];
        setChain([...currentChain]);
        step++;
        mineNext();
      }, 50);
    };

    mineNext();
  }, [chain, difficulty]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-primary/20">
              <Blocks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">
                Blockchain Visualizer
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Interactive blockchain demonstration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ValidationBadge isValid={valid} />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── Sidebar Controls ── */}
          <aside className="flex flex-col gap-5 lg:w-80 lg:shrink-0">
            {/* Control Panel Card */}
            <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 shadow-lg shadow-primary/[0.03]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Pickaxe className="h-3.5 w-3.5" />
                Mining Controls
              </div>
              <DifficultySelector
                difficulty={difficulty}
                onChange={setDifficulty}
              />
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <MiningForm
                onMine={handleMine}
                isMining={isMining || isAutoMining}
              />
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <AutoMine
                onAutoMine={handleAutoMine}
                isAutoMining={isAutoMining}
                autoMineProgress={autoMineProgress}
              />
            </div>

            {/* Transaction Ledger */}
            <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 shadow-lg shadow-primary/[0.03]">
              <TransactionLedger chain={chain} />
            </div>

            {/* How It Works */}
            <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 shadow-lg shadow-primary/[0.03]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  How It Works
                </div>
                <div className="flex flex-col gap-3 text-[12px] text-muted-foreground leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <Pickaxe className="h-3 w-3 text-primary" />
                    </div>
                    <p>
                      <span className="font-semibold text-foreground">
                        Mining:
                      </span>{" "}
                      Enter data and click Mine. The system finds a nonce that
                      produces a hash with the required leading zeros.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent/10">
                      <Link className="h-3 w-3 text-accent" />
                    </div>
                    <p>
                      <span className="font-semibold text-foreground">
                        Linking:
                      </span>{" "}
                      Each block stores the previous block{"'"}s hash, forming
                      an immutable chain.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-destructive/10">
                      <ShieldAlert className="h-3 w-3 text-destructive" />
                    </div>
                    <p>
                      <span className="font-semibold text-foreground">
                        Tampering:
                      </span>{" "}
                      Click the edit icon on any block to change its data. The
                      chain immediately becomes invalid.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </aside>

          {/* ── Chain Display ── */}
          <section className="flex-1" aria-label="Blockchain">
            <div className="flex flex-col items-center gap-0">
              {chain.map((block, i) => (
                <div
                  key={block.index}
                  className="flex w-full max-w-lg flex-col items-center animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {i > 0 && <ChainLink isValid={!invalidIndices.has(i)} />}
                  <div className="w-full">
                    <BlockCard
                      block={block}
                      isInvalid={invalidIndices.has(i)}
                      isGenesis={i === 0}
                      onEdit={handleEdit}
                    />
                  </div>
                </div>
              ))}
            </div>
            {chain.length === 1 && (
              <div className="mt-10 flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                  <Blocks className="h-6 w-6 text-primary/60" />
                </div>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  The Genesis Block is the first block in the chain.
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Enter data in the sidebar and mine your first block to build
                  the chain.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-6">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-center text-xs text-muted-foreground/60">
            Blockchain Demonstration
          </p>
        </div>
      </footer>
    </div>
  );
}
