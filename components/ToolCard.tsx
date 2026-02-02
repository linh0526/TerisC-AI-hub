'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, MessageSquare } from 'lucide-react';
import ReviewModal from './ReviewModal';

export interface Tool {
  id: string;
  _id?: string;
  name: string;
  description: string;
  category: string;
  price: string;
  link: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
}

export default function ToolCard({ tool, onReviewSuccess }: { tool: Tool, onReviewSuccess?: () => void }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  return (
    <>
      <motion.div
        className="group relative bg-card-bg border border-card-border rounded-3xl p-5 overflow-hidden transition-all hover:border-accent hover:shadow-xl hover:shadow-accent/5 shadow-sm h-full flex flex-col"
      >
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Sparkles size={20} />
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="px-2 py-0.5 bg-foreground/[0.03] rounded-full text-[10px] font-bold text-[var(--text-muted)] border border-card-border">
                {tool.price}
              </span>
              {tool.rating !== undefined && (
                <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold">
                  <span>★</span>
                  <span>{tool.rating.toFixed(1)}</span>
                  <span className="text-[var(--text-muted)] font-normal">({tool.reviewCount || 0})</span>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold mb-1.5 group-hover:text-accent transition-colors text-foreground truncate">
            {tool.name}
          </h3>
          
          <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-4 line-clamp-2 flex-grow">
            {tool.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {tool.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 bg-foreground/[0.03] rounded text-[var(--text-muted)] border border-card-border">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-2 mt-auto">
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                try {
                  await fetch('/api/stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'click' }),
                  });
                } catch (err) {
                  console.error('Click tracking failed');
                }
              }}
              className="flex items-center justify-center flex-1 gap-2 py-2.5 rounded-xl bg-foreground/[0.05] hover:bg-accent hover:text-white text-foreground text-sm font-medium transition-all group-hover:shadow-[0_0_15px_rgba(124,58,237,0.15)]"
            >
              <span>Truy cập</span>
              <ExternalLink size={14} />
            </a>
            <button
              onClick={() => setIsReviewOpen(true)}
              className="p-2.5 rounded-xl bg-foreground/[0.03] border border-card-border text-[var(--text-muted)] hover:text-accent hover:border-accent transition-all"
              title="Viết nhận xét"
            >
              <MessageSquare size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      <ReviewModal
        toolId={tool._id || tool.id}
        toolName={tool.name}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSuccess={() => {
          if (onReviewSuccess) onReviewSuccess();
        }}
      />
    </>
  );
}
