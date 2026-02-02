'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto group">
      <div className="absolute inset-0 bg-accent rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity" />
      <div className="relative flex items-center bg-card-bg/80 backdrop-blur-xl border border-card-border rounded-2xl p-2 transition-colors group-hover:border-accent/50 shadow-lg">
        <Search className="ml-4 text-[var(--text-muted)] w-5 h-5" />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tìm kiếm công cụ AI (VD: Chatbot, Video...)"
          className="w-full bg-transparent border-none outline-none text-foreground px-4 py-2 placeholder-[var(--text-muted)]/50"
        />
        <button className="bg-accent text-white font-semibold px-6 py-2 rounded-xl hover:opacity-90 transition-colors shadow-lg shadow-accent/20">
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}
