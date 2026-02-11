"use client";

import { useState } from "react";
import type { BlockData } from "@/lib/blockchain";
import {
  Hash,
  Clock,
  Database,
  Link,
  Cpu,
  Pencil,
  Check,
  X,
  Timer,
} from "lucide-react";

interface BlockCardProps {
  block: BlockData;
  isInvalid: boolean;
  isGenesis: boolean;
  onEdit?: (index: number, newData: string) => void;
}

export function BlockCard({
  block,
  isInvalid,
  isGenesis,
  onEdit,
}: BlockCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(block.data);

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(block.index, editData);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData(block.data);
    setIsEditing(false);
  };

  const formatTimestamp = (ts: number) => {
    if (ts === 0) return "Genesis";
    return new Date(ts).toLocaleString();
  };

  const truncateHash = (hash: string) => {
    if (hash === "0") return "0";
    return hash.substring(0, 12) + "…";
  };

  const borderClass = isInvalid
    ? "border-destructive/50 shadow-[0_0_30px_rgba(239,68,68,0.12)]"
    : isGenesis
      ? "border-primary/30 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
      : "border-border/60 hover:border-primary/30 hover:shadow-[0_0_24px_rgba(139,92,246,0.08)]";

  const headerBgClass = isInvalid
    ? "bg-destructive/10"
    : isGenesis
      ? "bg-gradient-to-r from-primary/10 to-accent/10"
      : "bg-muted/50";

  const indexBadgeClass = isInvalid
    ? "bg-destructive/15 text-destructive ring-1 ring-destructive/20"
    : isGenesis
      ? "bg-primary/15 text-primary ring-1 ring-primary/20"
      : "bg-accent/15 text-accent ring-1 ring-accent/20";

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border-2 transition-all duration-300 bg-card/90 backdrop-blur-sm ${borderClass}`}
    >
      {/* Block Header */}
      <div
        className={`flex items-center justify-between px-5 py-3.5 ${headerBgClass}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold font-mono ${indexBadgeClass}`}
          >
            #{block.index}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {isGenesis ? "Genesis Block" : `Block ${block.index}`}
            </p>
            {block.miningTime !== undefined && (
              <div className="flex items-center gap-1 mt-0.5">
                <Timer className="h-3 w-3 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">
                  Mined in {block.miningTime}ms
                </p>
              </div>
            )}
          </div>
        </div>
        {!isGenesis && onEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
            aria-label="Edit block data"
            title="Edit block data"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Block Fields */}
      <div className="flex flex-col gap-0 px-5 py-4">
        <FieldRow
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Timestamp"
          value={formatTimestamp(block.timestamp)}
        />

        <div className="h-px bg-border/30 my-1.5" />

        {/* Data field with inline editing */}
        <div className="flex items-start gap-2.5 py-1.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground mt-0.5">
            <Database className="h-3.5 w-3.5" />
          </div>
          <span className="shrink-0 text-xs text-muted-foreground w-20 mt-0.5">
            Data
          </span>
          {isEditing ? (
            <div className="flex flex-1 items-center gap-1.5">
              <input
                type="text"
                value={editData}
                onChange={(e) => setEditData(e.target.value)}
                className="flex-1 rounded-lg border border-primary/40 bg-muted px-2.5 py-1 text-xs font-mono text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_rgba(139,92,246,0.15)]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
              />
              <button
                onClick={handleSaveEdit}
                className="flex h-6 w-6 items-center justify-center rounded-md text-success transition-colors hover:bg-success/15"
                aria-label="Save edit"
                title="Save (Enter)"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex h-6 w-6 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/15"
                aria-label="Cancel edit"
                title="Cancel (Esc)"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <span
              className={`text-xs font-mono break-all mt-0.5 ${isInvalid ? "text-destructive" : "text-foreground"}`}
            >
              {block.data}
            </span>
          )}
        </div>

        <div className="h-px bg-border/30 my-1.5" />

        <FieldRow
          icon={<Link className="h-3.5 w-3.5" />}
          label="Prev Hash"
          value={truncateHash(block.previousHash)}
          mono
          color={isGenesis ? "text-muted-foreground" : "text-accent"}
        />

        <div className="h-px bg-border/30 my-1.5" />

        <FieldRow
          icon={<Cpu className="h-3.5 w-3.5" />}
          label="Nonce"
          value={block.nonce.toLocaleString()}
          mono
        />

        <div className="h-px bg-border/30 my-1.5" />

        <FieldRow
          icon={<Hash className="h-3.5 w-3.5" />}
          label="Hash"
          value={truncateHash(block.hash)}
          mono
          color={isInvalid ? "text-destructive" : "text-primary"}
        />
      </div>

      {/* Invalid badge */}
      {isInvalid && (
        <div className="absolute -top-0 -right-0 rounded-bl-xl rounded-tr-2xl bg-destructive px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground shadow-lg">
          Tampered
        </div>
      )}

      {/* Genesis glow strip */}
      {isGenesis && !isInvalid && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      )}
    </div>
  );
}

function FieldRow({
  icon,
  label,
  value,
  mono,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <span className="shrink-0 text-xs text-muted-foreground w-20">
        {label}
      </span>
      <span
        className={`text-xs break-all ${mono ? "font-mono" : ""} ${color || "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}
