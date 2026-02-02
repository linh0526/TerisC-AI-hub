'use client';

import { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewModalProps {
  toolId: string;
  toolName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ toolId, toolName, isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/tools/${toolId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, rating, comment }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setUserName('');
        setComment('');
        setRating(5);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-card-bg border border-card-border w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
          >
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-foreground/5 transition-colors text-[var(--text-muted)]"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-1 text-foreground">Đánh giá công cụ</h2>
            <p className="text-sm text-accent mb-8 font-medium">{toolName}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center gap-2 py-4 bg-foreground/[0.02] rounded-3xl border border-card-border">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Bạn chấm mấy sao?</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoverRating || rating)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-card-border'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Tên của bạn</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-3.5 outline-none focus:border-accent text-sm"
                    placeholder="VD: Nguyễn Văn A"
                    value={userName || ''}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Nhận xét</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-3.5 outline-none focus:border-accent text-sm resize-none"
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    value={comment || ''}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span>Gửi đánh giá</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
