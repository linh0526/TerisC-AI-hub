'use client';

interface CategoryPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryPill({ label, active, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
        active
          ? 'bg-accent border-accent text-white shadow-lg shadow-accent/25'
          : 'bg-card-bg border-card-border text-[var(--text-muted)] hover:bg-foreground/[0.05] hover:border-card-border hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}
