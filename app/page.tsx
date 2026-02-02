'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import ToolCard, { Tool } from '@/components/ToolCard';
import SearchBar from '@/components/SearchBar';
import CategoryPill from '@/components/CategoryPill';
import ThemeToggle from '@/components/ThemeToggle';
import ReviewCard from '@/components/ReviewCard';
import Footer from '@/components/Footer';
import SubmitModal from '@/components/SubmitModal';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Github, Mail } from 'lucide-react';

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const itemsPerPage = 8;

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 50], ["rgba(var(--background-rgb), 0)", "rgba(var(--card-bg-rgb), 0.7)"]);
  const navBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const navBorder = useTransform(scrollY, [0, 50], ["1px solid transparent", "1px solid var(--card-border)"]);

  const fetchTools = useCallback(async (page: number, cat: string, query: string) => {
    setLoading(true);
    try {
      const url = `/api/tools?page=${page}&limit=${itemsPerPage}&category=${encodeURIComponent(cat)}&search=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.tools) {
        setTools(data.tools);
        setTotalPages(data.metadata.pages);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]); // itemsPerPage is a dependency

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTools(1, activeCategory, searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, fetchTools]);

  // Page change effect
  useEffect(() => {
    // Only fetch if currentPage changes and it's not the initial load handled by the debounced effect
    // or if activeCategory/searchQuery changes, which also triggers the debounced effect
    // This useEffect is primarily for when the user clicks pagination buttons
    fetchTools(currentPage, activeCategory, searchQuery);
  }, [currentPage, fetchTools]); // Removed activeCategory, searchQuery from dependencies here to avoid double fetch with debounced effect

  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view' }),
        });
      } catch (err) {
        console.error('Failed to track view');
      }
    };
    trackView();
  }, []); // Run once on mount

  // Extract real reviews
  const realReviews = useMemo(() => {
    const allReviews: any[] = [];
    tools.forEach(tool => {
      if (tool && (tool as any).reviews) {
        (tool as any).reviews.forEach((rev: any) => {
          allReviews.push({
            _id: rev._id || Math.random().toString(),
            userName: rev.user,
            toolName: tool.name,
            comment: rev.comment,
            rating: rev.rating
          });
        });
      }
    });
    return allReviews;
  }, [tools]);

  const marqueeItems = useMemo(() => {
    // Multiply items to ensure seamless loop regardless of screen width
    return [...realReviews, ...realReviews, ...realReviews, ...realReviews];
  }, [realReviews]);

  return (
    <main className="min-h-screen max-w-7xl mx-auto overflow-x-hidden pt-32">
      {/* Sticky Navigation */}
      <motion.nav 
        style={{ background: navBg, backdropFilter: navBlur, borderBottom: navBorder }}
        className="fixed top-0 left-0 right-0 z-[100] h-20 flex items-center transition-all"
      >
        <div className="max-w-7xl mx-auto w-full px-8 md:px-12 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-sm">A</div>
            AI Hub
          </div>
          <div className="flex gap-6 items-center">
            <div className="hidden md:flex gap-8 text-sm font-medium text-[var(--text-muted)]">
              <a href="#" className="hover:text-foreground transition-colors">Danh mục</a>
              <a href="#" className="hover:text-foreground transition-colors">Phổ biến</a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-4 border-l border-card-border pl-4 ml-2">
                <a href="https://github.com/linh0526" target="_blank" className="text-[var(--text-muted)] hover:text-accent transition-colors" title="GitHub"><Github size={18} /></a>
                <a href="mailto:linhsubin007@gmail.com" className="text-[var(--text-muted)] hover:text-accent transition-colors" title="Gmail"><Mail size={18} /></a>
              </div>
              <button 
                onClick={() => setIsSubmitOpen(true)}
                className="bg-accent text-white px-5 py-2 rounded-full hover:opacity-90 transition-all shadow-lg shadow-accent/20 text-sm font-semibold"
              >
                Gửi công cụ
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="px-8 md:px-12">
        {/* Hero Section */}
        <section className="text-center mb-16 pt-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-foreground">
            Khai phá sức mạnh <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent/50">
              Trí tuệ nhân tạo
            </span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Khám phá thư viện công cụ AI lớn nhất giúp tối ưu hiệu suất công việc.
          </p>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </section>

        {/* Categories */}
        <section className="flex flex-wrap justify-center gap-4 mb-12">
          {['Tất cả', 'Chatbot', 'Hình ảnh', 'Lập trình', 'Video', 'Âm nhạc'].map((cat) => (
            <CategoryPill 
              key={cat} 
              label={cat} 
              active={activeCategory === cat} 
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </section>

        {/* Tools Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-60 bg-card-bg border border-card-border rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-12 mb-20">
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-8">
              {tools.length > 0 ? (
                tools.map((tool) => (
                  <ToolCard 
                    key={tool.id || (tool as any)._id} 
                    tool={tool} 
                    onReviewSuccess={() => fetchTools(currentPage, activeCategory, searchQuery)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-card-bg/50 border border-dashed border-card-border rounded-[2rem]">
                  <p className="text-[var(--text-muted)]">Chưa có công cụ nào khớp với tìm kiếm.</p>
                </div>
              )}
            </section>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => p - 1);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-2xl bg-card-bg border border-card-border text-foreground disabled:opacity-30 hover:border-accent transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-bold text-foreground">
                  Trang {currentPage} / {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => p + 1);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-2xl bg-card-bg border border-card-border text-foreground disabled:opacity-30 hover:border-accent transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Marquee */}
      <section className="mt-32 overflow-hidden py-10 bg-foreground/[0.02] border-y border-card-border">
        {/* ... marquee reviews ... */}
        <div className="px-10 md:px-14 mb-10">
          <h2 className="text-2xl font-bold text-foreground text-center">💬 Cộng đồng nói gì về AI?</h2>
        </div>
        
        <div className="relative flex overflow-hidden group">
          <motion.div 
            className="flex gap-6 pr-6 py-4"
            animate={{ x: [0, "-50%"] }}
            transition={{
              x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" },
            }}
            whileHover={{ animationPlayState: "paused" }}
            style={{ width: "max-content" }}
          >
            {marqueeItems.map((review: any, idx: number) => (
              <ReviewCard key={`${review._id}-${idx}`} review={review} />
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Submission Modal */}
      <SubmitModal 
        isOpen={isSubmitOpen} 
        onClose={() => setIsSubmitOpen(false)} 
      />
    </main>
  );
}
