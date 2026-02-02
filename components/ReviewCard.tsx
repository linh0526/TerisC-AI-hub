'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Review {
  _id: string;
  userName: string;
  toolName: string;
  comment: string;
  rating: number;
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-card-bg border border-card-border rounded-3xl p-6 min-w-[300px] md:w-[400px] flex-none relative overflow-hidden shadow-sm">
      <Quote className="absolute -right-2 -top-2 w-20 h-20 text-accent/5 -rotate-12" />
      <div className="relative z-10">
        <div className="flex items-center gap-1 text-yellow-500 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < review.rating ? "fill-current" : "text-gray-300"}>★</span>
          ))}
        </div>
        <p className="text-foreground text-sm italic mb-6 leading-relaxed">
          "{review.comment}"
        </p>
        <div className="flex items-center gap-3 border-t border-card-border pt-4">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent uppercase">
            {review.userName.charAt(0)}
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">{review.userName}</h4>
            <p className="text-[10px] text-[var(--text-muted)]">Nhận xét về <span className="text-accent">{review.toolName}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
