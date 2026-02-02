'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitModal({ isOpen, onClose }: SubmitModalProps) {
  const [status, setStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Chatbot',
    price: 'Free',
    link: '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Đang gửi...');
    
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          isApproved: false
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setStatus('');
        // Clear form after delay
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', description: '', category: 'Chatbot', price: 'Free', link: '', tags: '' });
          onClose();
        }, 3000);
      } else {
        setStatus('Lỗi khi gửi.');
      }
    } catch (err) {
      setStatus('Lỗi kết nối.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-card-bg border border-card-border w-full max-w-2xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-foreground/5 transition-colors text-[var(--text-muted)] z-10"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-10 text-center">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">Gửi thành công!</h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Cảm ơn đóng góp của bạn. Admin sẽ kiểm duyệt và đăng tải sớm nhất.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Đề xuất công cụ AI</h2>
                    <p className="text-xs text-[var(--text-muted)] uppercase font-black tracking-widest mt-1">Community Contribution</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Tên công cụ</label>
                      <input
                        type="text" required
                        className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-3.5 outline-none focus:border-accent text-sm"
                        placeholder="VD: ChatGPT"
                        value={formData.name || ''}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Link (URL)</label>
                      <input
                        type="url" required
                        className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-3.5 outline-none focus:border-accent text-sm"
                        placeholder="https://..."
                        value={formData.link || ''}
                        onChange={e => setFormData({...formData, link: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Chuyên mục</label>
                        <select
                          className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-3.5 outline-none focus:border-accent text-sm appearance-none"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                          <option>Chatbot</option>
                          <option>Hình ảnh</option>
                          <option>Lập trình</option>
                          <option>Video</option>
                          <option>Âm nhạc</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Giá</label>
                        <input
                          type="text" required
                          className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-3.5 outline-none focus:border-accent text-sm"
                          placeholder="Free/Paid"
                          value={formData.price || ''}
                          onChange={e => setFormData({...formData, price: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Mô tả ngắn</label>
                      <textarea
                        required rows={5}
                        className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-3.5 outline-none focus:border-accent text-sm resize-none"
                        placeholder="Mô tả công dụng chính..."
                        value={formData.description || ''}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Tags (cách bởi dấu phẩy)</label>
                      <input
                        type="text"
                        placeholder="ai, assistant..."
                        className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-3.5 outline-none focus:border-accent text-sm"
                        value={formData.tags || ''}
                        onChange={e => setFormData({...formData, tags: e.target.value})}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status !== ''}
                    className="col-span-full bg-accent text-white font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-accent/30 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
                  >
                    <Send size={18} />
                    <span>{status || 'Gửi đề xuất'}</span>
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
