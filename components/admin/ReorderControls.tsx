// No 'use client' directive: this is only rendered by the admin managers, which
// are already client components. Marking it as a client entry would forbid the
// function prop below.
type ReorderControlsProps = {
  /** 1-based position within the list the client is currently looking at. */
  position: number;
  total: number;
  onMove: (delta: -1 | 1) => void;
};

/** Move-left / move-right buttons shown on each card while reordering. */
export default function ReorderControls({ position, total, onMove }: ReorderControlsProps) {
  const button =
    'flex-1 rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-35 disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text-secondary)]';

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={position <= 1}
        aria-label="Move earlier"
        className={button}
      >
        ←
      </button>
      <span className="min-w-[3.5rem] text-center text-xs tabular-nums text-[var(--color-text-muted)]">
        {position} / {total}
      </span>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={position >= total}
        aria-label="Move later"
        className={button}
      >
        →
      </button>
    </div>
  );
}
