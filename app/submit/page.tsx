'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function SubmitTool() {
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
    setStatus('Đang gửi tin...');
    
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          isApproved: false // Explicitly unapproved
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setStatus('');
      } else {
        setStatus('Lỗi khi gửi. Vui lòng thử lại.');
      }
    } catch (err) {
      setStatus('Lỗi kết nối server.');
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card-bg border border-card-border p-12 rounded-[3rem] text-center max-w-md shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Gửi thành công!</h2>
          <p className="text-[var(--text-muted)] mb-8 leading-relaxed">
            Cảm ơn bạn đã đóng góp. Công cụ của bạn đang chờ Admin kiểm duyệt trước khi xuất hiện trên trang chủ.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all"
          >
            <ArrowLeft size={18} />
            Quay lại trang chủ
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 md:p-12 max-w-4xl mx-auto">
      <nav className="flex justify-between items-center mb-16">
        <a href="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-foreground transition-colors font-medium">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </a>
        <ThemeToggle />
      </nav>

      <header className="text-center mb-16">
        <div className="bg-accent/10 text-accent w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">Đề xuất công cụ AI</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Chia sẻ những công cụ AI tuyệt vời mà bạn biết với cộng đồng. 
          Chúng tôi sẽ kiểm duyệt và đăng tải sớm nhất.
        </p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg border border-card-border rounded-[2.5rem] p-8 md:p-12 shadow-xl"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Tên công cụ</label>
              <input
                type="text" required
                className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-4 outline-none focus:border-accent transition-all"
                placeholder="VD: ChatGPT"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Đường dẫn (URL)</label>
              <input
                type="url" required
                className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-4 outline-none focus:border-accent transition-all"
                placeholder="https://..."
                value={formData.link}
                onChange={e => setFormData({...formData, link: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Chuyên mục</label>
                <select
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-4 outline-none focus:border-accent transition-all appearance-none"
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
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Giá cả</label>
                <input
                  type="text" required
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-4 outline-none focus:border-accent transition-all"
                  placeholder="Free / Paid"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Mô tả ngắn</label>
              <textarea
                required rows={5}
                className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-4 outline-none focus:border-accent transition-all resize-none"
                placeholder="Nêu bật tính năng chính của công cụ..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest ml-1 mb-2 block">Thẻ (ngăn cách bởi dấu phẩy)</label>
              <input
                type="text"
                placeholder="ai, assistant, coding..."
                className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-5 py-4 outline-none focus:border-accent transition-all"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
              />
            </div>
          </div>

          <div className="col-span-full pt-4">
            <button
              type="submit"
              disabled={status !== ''}
              className="w-full bg-accent text-white font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              <Send size={20} />
              <span>{status || 'Gửi đề xuất kiểm duyệt'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
