'use client';

import { useEffect, useState } from 'react';
import { Activity, MousePointer2, Eye, Github, Mail } from 'lucide-react';

export default function Footer() {
  const [stats, setStats] = useState({ pageViews: 0, toolClicks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.pageViews !== undefined) {
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    fetchStats();
    
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative mt-20 border-t border-card-border bg-card-bg/40 backdrop-blur-2xl py-12 px-8 overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
        {/* Left Side: Contact info instead of brand */}
        <div className="flex gap-4">
          <a 
            href="mailto:linhsubin007@gmail.com" 
            className="w-10 h-10 rounded-xl bg-foreground/[0.03] border border-card-border flex items-center justify-center text-[var(--text-muted)] hover:text-accent hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/10"
            title="Gửi Gmail"
          >
            <Mail size={18} />
          </a>
          <a 
            href="https://github.com/linh0526" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-foreground/[0.03] border border-card-border flex items-center justify-center text-[var(--text-muted)] hover:text-accent hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/10"
            title="Xem GitHub"
          >
            <Github size={18} />
          </a>
        </div>

        {/* Center: Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center gap-1 group">
            <div className="flex items-center gap-2 text-accent">
              <Eye size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-black text-foreground">{stats.pageViews.toLocaleString()}</span>
            </div>
            <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-[0.2em]">Lượt truy cập</span>
          </div>

          <div className="flex flex-col items-center gap-1 group">
            <div className="flex items-center gap-2 text-accent">
              <MousePointer2 size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-black text-foreground">{stats.toolClicks.toLocaleString()}</span>
            </div>
            <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-[0.2em]">Số lượt Click</span>
          </div>

          <div className="flex flex-col items-center gap-1 group">
            <div className="flex items-center gap-2 text-green-500">
              <Activity size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-black text-foreground">99.9%</span>
            </div>
            <span className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-[0.2em]">Hệ thống</span>
          </div>
        </div>

        {/* Right Side: Copyright & Legal */}
        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
          <p className="text-sm font-bold text-foreground">
            © 2026 <span className="text-accent underline decoration-2 underline-offset-4 decoration-accent/30">TerisC AI Hub</span>
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            <a href="#" className="hover:text-accent transition-all">Điều khoản</a>
            <a href="#" className="hover:text-accent transition-all">Bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
