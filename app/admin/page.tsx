'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Trash2, Edit, Plus, X, Search, ChevronLeft, FileJson, 
  CheckCircle2, Clock, MessageCircle, LayoutDashboard, 
  ListChecks, Star, User, Calendar, AlertCircle, ChevronDown,
  ChevronUp, Check, Hash, LogOut
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [pendingTools, setPendingTools] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const [statsData, setStatsData] = useState({ totalTools: 0, pendingToolsCount: 0, totalReviews: 0 });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pending' | 'reviews'>('dashboard');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Chatbot',
    price: 'Free',
    link: '',
    tags: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBulk, setIsBulk] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [checkingLink, setCheckingLink] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  
  // Pagination for main list
  const [toolsPage, setToolsPage] = useState(1);
  const [toolsTotalPages, setToolsTotalPages] = useState(1);

  // Debounce link checking
  useEffect(() => {
    if (!formData.link || editingId) {
      setIsDuplicate(false);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingLink(true);
      try {
        const res = await fetch(`/api/tools/check-link?link=${encodeURIComponent(formData.link)}`);
        const data = await res.json();
        setIsDuplicate(data.exists);
      } catch (err) {
        console.error('Check link error');
      } finally {
        setCheckingLink(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.link, editingId]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data && typeof data.totalTools === 'number') setStatsData(data);
    } catch (err) {
      console.error('Fetch stats error');
    }
  };

  const fetchTools = async (page: number, search: string) => {
    try {
      const res = await fetch(`/api/tools?all=true&page=${page}&limit=10&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data && data.tools) {
        setTools(data.tools);
        setToolsTotalPages(data.metadata.pages);
      }
    } catch (err) {
      console.error('Fetch tools error');
    }
  };

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/admin/pending');
      const data = await res.json();
      if (Array.isArray(data)) setPendingTools(data);
    } catch (err) {
      console.error('Fetch pending error');
    }
  };

  const fetchReviews = async (page: number) => {
    try {
      const res = await fetch(`/api/admin/reviews?page=${page}&limit=10`);
      const data = await res.json();
      if (data && data.reviews) setReviews(data.reviews);
    } catch (err) {
      console.error('Fetch reviews error');
    }
  };

// ... imports

  // ... (existing codes)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
      if (typeof window !== 'undefined') window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout failed');
    }
  };

  const fetchCategories = async () => {

    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) setAllCategories(data);
    } catch (err) {
      console.error('Fetch categories error');
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCategories();
    if (activeTab === 'dashboard') fetchTools(toolsPage, searchTerm);
    if (activeTab === 'pending') fetchPending();
    if (activeTab === 'reviews') fetchReviews(1);
  }, [activeTab, toolsPage, searchTerm]);
  
  // Debounced search for admin
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'dashboard') fetchTools(1, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Đang xử lý...');
    
    try {
      if (isBulk) {
        const toolsToImport = JSON.parse(bulkData);
        const res = await fetch('/api/tools/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toolsToImport),
        });
        const resData = await res.json();
        if (res.ok) {
          setStatus(resData.message || 'Nhập hàng loạt thành công!');
          setBulkData('');
          fetchStats();
          fetchTools(1, '');
        } else {
          setStatus(resData.error || 'Lỗi khi nhập hàng loạt.');
        }
      } else {
        const formattedTags = typeof formData.tags === 'string' 
          ? formData.tags.split(',').map(tag => tag.trim())
          : formData.tags;

        const url = editingId ? `/api/tools/${editingId}` : '/api/tools';
        const method = editingId ? 'PATCH' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            tags: formattedTags,
            isApproved: true
          }),
        });

        const resData = await res.json();
        
        if (res.ok) {
          setStatus(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
          setFormData({ name: '', description: '', category: 'Chatbot', price: 'Free', link: '', tags: '' });
          setEditingId(null);
          fetchStats();
          fetchTools(1, '');
        } else {
          setStatus(resData.error || 'Lỗi khi lưu dữ liệu.');
        }
      }
      setTimeout(() => setStatus(''), editingId ? 3000 : 5000);
    } catch (err) {
      console.error(err);
      setStatus('Lỗi dữ liệu.');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/tools/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true }),
      });
      if (res.ok) {
        fetchStats();
        fetchTools(1, '');
      }
    } catch (err) {
      if (typeof window !== 'undefined') window.alert('Lỗi khi duyệt.');
    }
  };

  const handleDeleteReview = async (toolId: string, reviewId: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Xóa nhận xét này?')) return;
    if (typeof window !== 'undefined') {
      window.alert('Tính năng xóa nhận xét cụ thể sẽ được cập nhật. Hiện tại bạn có thể chỉnh sửa công cụ.');
    }
  };

  const handleEdit = (tool: any) => {
    setEditingId(tool._id);
    setFormData({
      name: tool.name || '',
      description: tool.description || '',
      category: tool.category || 'Chatbot',
      price: tool.price || 'Free',
      link: tool.link || '',
      tags: Array.isArray(tool.tags) ? tool.tags.join(', ') : '',
    });
    setActiveTab('dashboard');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleDeleteMany = async () => {
    if (typeof window !== 'undefined' && !window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} công cụ đã chọn?`)) return;
    try {
      const res = await fetch('/api/tools/delete-many', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchStats();
        fetchTools(1, '');
      }
    } catch (err) {
      if (typeof window !== 'undefined') window.alert('Lỗi khi xóa nhiều.');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === tools.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tools.map(t => t._id));
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchStats();
        fetchTools(1, '');
      }
    } catch (err) {
      if (typeof window !== 'undefined') window.alert('Lỗi khi xóa.');
    }
  };

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <a href="/" className="p-3 rounded-2xl bg-card-bg border border-card-border hover:border-accent transition-all">
              <ChevronLeft size={20} />
            </a>
            <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
              Admin <span className="text-accent">Console</span>
            </h1>
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex bg-card-bg border border-card-border p-1.5 rounded-2xl gap-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'hover:bg-foreground/5 text-[var(--text-muted)]'}`}
            >
              <LayoutDashboard size={18} />
              Tổng quan
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative ${activeTab === 'pending' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'hover:bg-foreground/5 text-[var(--text-muted)]'}`}
            >
              <ListChecks size={18} />
              Duyệt AI
              {pendingTools.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-background animate-pulse">{pendingTools.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'reviews' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'hover:bg-foreground/5 text-[var(--text-muted)]'}`}
            >
              <MessageCircle size={18} />
              Nhận xét
            </button>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={handleLogout}
                className="p-3 rounded-2xl bg-red-500/10 text-red-500 border border-transparent hover:border-red-500 hover:bg-red-500 hover:text-white transition-all"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            <ThemeToggle />
          </div>
        </header>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col lg:flex-row gap-8 items-start"
              >
                {/* Form Section */}
                <div className="w-full lg:w-1/2 sticky top-10">
                  <div className="bg-card-bg border border-card-border rounded-[2.5rem] p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        {editingId ? <Edit size={24} className="text-accent" /> : <Plus size={24} className="text-accent" />}
                        {editingId ? 'Chỉnh sửa' : 'Thêm AI mới'}
                      </h2>
                      <div className="flex gap-2 bg-foreground/5 p-1 rounded-xl">
                        <button onClick={() => setIsBulk(false)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isBulk ? 'bg-white text-black shadow-sm' : 'text-[var(--text-muted)]'}`}>Single</button>
                        <button onClick={() => setIsBulk(true)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isBulk ? 'bg-white text-black shadow-sm' : 'text-[var(--text-muted)]'}`}>Bulk JSON</button>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {!isBulk ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Tên AI</label>
                              <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-4 py-3.5 outline-none focus:border-accent text-sm" placeholder="VD: ChatGPT" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Website Link</label>
                              <div className="relative">
                                <input 
                                  type="url" 
                                  required 
                                  value={formData.link || ''} 
                                  onChange={e => setFormData({...formData, link: e.target.value})} 
                                  className={`w-full bg-foreground/[0.03] border rounded-2xl px-4 py-3.5 outline-none transition-all text-sm ${
                                    isDuplicate ? 'border-red-500 focus:border-red-600 bg-red-500/5' : 'border-card-border focus:border-accent'
                                  }`} 
                                  placeholder="https://..." 
                                />
                                {checkingLink && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>}
                              </div>
                              {isDuplicate && (
                                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                                  <AlertCircle size={12} /> Website này đã tồn tại trong thư viện!
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Mô tả ngắn</label>
                            <textarea required rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-4 py-3.5 outline-none focus:border-accent text-sm resize-none" placeholder="Điểm mạnh gì?" />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="relative">
                                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Chuyên mục</label>
                                <div 
                                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-4 py-3.5 flex justify-between items-center cursor-pointer hover:border-accent transition-all mt-2"
                                >
                                  <span className="text-sm font-medium">{formData.category || 'Chọn chuyên mục'}</span>
                                  {showCategoryDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>

                                <AnimatePresence>
                                  {showCategoryDropdown && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute left-0 right-0 mt-3 bg-card-bg border border-card-border rounded-[1.5rem] shadow-2xl z-[100] overflow-hidden backdrop-blur-xl"
                                    >
                                      <div className="p-3 border-b border-card-border">
                                        <div className="relative">
                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
                                          <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="Tìm hoặc tạo mới..." 
                                            value={catSearch}
                                            onChange={(e) => setCatSearch(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter' && catSearch) {
                                                e.preventDefault();
                                                setFormData({...formData, category: catSearch});
                                                if (!allCategories.includes(catSearch)) {
                                                  setAllCategories([...allCategories, catSearch]);
                                                }
                                                setShowCategoryDropdown(false);
                                                setCatSearch('');
                                              }
                                            }}
                                            className="w-full bg-foreground/[0.03] rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:bg-foreground/[0.05] transition-all"
                                          />
                                        </div>
                                      </div>
                                      <div className="max-h-[220px] overflow-y-auto p-2 custom-scrollbar">
                                        {allCategories
                                          .filter(c => c.toLowerCase().includes(catSearch.toLowerCase()))
                                          .map((cat) => (
                                            <div 
                                              key={cat}
                                              onClick={() => {
                                                setFormData({...formData, category: cat});
                                                setShowCategoryDropdown(false);
                                                setCatSearch('');
                                              }}
                                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent/10 hover:text-accent cursor-pointer transition-all text-xs font-bold group"
                                            >
                                              <span className="flex items-center gap-2">
                                                <Hash size={12} className="opacity-40 group-hover:opacity-100" />
                                                {cat}
                                              </span>
                                              {formData.category === cat && <Check size={14} />}
                                            </div>
                                          ))}
                                        {catSearch && !allCategories.some(c => c.toLowerCase() === catSearch.toLowerCase()) && (
                                          <div 
                                            onClick={() => {
                                              setFormData({...formData, category: catSearch});
                                              setAllCategories([...allCategories, catSearch]);
                                              setShowCategoryDropdown(false);
                                              setCatSearch('');
                                            }}
                                            className="p-3 rounded-xl bg-accent/5 text-accent cursor-pointer hover:bg-accent/10 transition-all text-xs font-black mt-1 flex items-center gap-2"
                                          >
                                            <Plus size={14} /> Tạo: "{catSearch}"
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Giá cả</label>
                                <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-4 py-3.5 outline-none focus:border-accent text-sm" placeholder="Free/Paid" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Tags (phẩy)</label>
                                <input type="text" value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl px-4 py-3.5 outline-none focus:border-accent text-sm" placeholder="AI, Chat" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <textarea rows={10} value={bulkData} onChange={e => setBulkData(e.target.value)} className="w-full bg-foreground/[0.03] border border-card-border rounded-[2rem] px-5 py-5 outline-none focus:border-accent text-xs font-mono" placeholder="Paste JSON tools array..." />
                      )}
                      <div className="flex gap-4">
                        <button 
                          type="submit" 
                          disabled={isDuplicate || checkingLink}
                          className="flex-1 bg-accent text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {editingId ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                        {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({name:'',description:'',category:'Chatbot',price:'Free',link:'',tags:''})}} className="p-4 bg-foreground/5 rounded-2xl hover:text-red-500 transition-colors"><X/></button>}
                      </div>
                    </form>
                  </div>
                </div>

                {/* List Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="bg-card-bg border border-card-border rounded-[2.5rem] p-8 shadow-xl">
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                      <input type="text" placeholder="Tìm tên AI..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-accent transition-all text-sm" />
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length === tools.length && tools.length > 0} 
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-card-border accent-accent cursor-pointer"
                        />
                        <span className="text-xs font-bold text-[var(--text-muted)]">Chọn tất cả</span>
                      </div>
                      {selectedIds.length > 0 && (
                        <button 
                          onClick={handleDeleteMany}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all animate-in fade-in slide-in-from-top-2"
                        >
                          <Trash2 size={14} /> Xóa {selectedIds.length} mục
                        </button>
                      )}
                    </div>

                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                      {tools.map(tool => (
                        <div key={tool._id} className={`group bg-foreground/[0.02] border p-4 rounded-2xl flex items-center justify-between transition-all ${selectedIds.includes(tool._id) ? 'border-accent/50 bg-accent/5' : 'border-card-border'}`}>
                          <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                            <input 
                              type="checkbox" 
                              checked={selectedIds.includes(tool._id)} 
                              onChange={() => toggleSelect(tool._id)}
                              className="w-4 h-4 rounded border-card-border accent-accent cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-sm truncate">{tool.name}</h3>
                                {tool.isApproved === false && (
                                  <span className="bg-yellow-500/10 text-yellow-600 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Clock size={10} /> CHỜ DUYỆT
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] font-black uppercase text-accent tracking-widest">{tool.category}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(tool)} className="p-2.5 rounded-xl bg-accent/5 text-accent hover:bg-accent hover:text-white transition-all"><Edit size={16}/></button>
                            <button onClick={() => handleDelete(tool._id)} className="p-2.5 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Simple Pagination for Tools */}
                    {toolsTotalPages > 1 && (
                      <div className="flex justify-center items-center gap-3 pt-4 border-t border-card-border">
                        <button disabled={toolsPage === 1} onClick={() => setToolsPage(p => p - 1)} className="p-2 rounded-lg bg-foreground/5 disabled:opacity-30">Prev</button>
                        <span className="text-xs font-bold">{toolsPage} / {toolsTotalPages}</span>
                        <button disabled={toolsPage === toolsTotalPages} onClick={() => setToolsPage(p => p + 1)} className="p-2 rounded-lg bg-foreground/5 disabled:opacity-30">Next</button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PENDING TAB */}
            {activeTab === 'pending' && (
              <motion.div 
                key="pending"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-card-bg border border-card-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-16 h-16 bg-yellow-500/10 text-yellow-600 rounded-[1.5rem] flex items-center justify-center">
                        <Clock size={32} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">Danh sách chờ duyệt</h2>
                        <p className="text-[var(--text-muted)]">Kiểm duyệt các đề xuất mới từ cộng đồng ({statsData.pendingToolsCount})</p>
                      </div>
                    </div>

                    {pendingTools.length === 0 ? (
                      <div className="py-20 text-center border-2 border-dashed border-card-border rounded-[2rem]">
                        <p className="text-[var(--text-muted)] font-medium">Hiện không có công cụ nào chờ duyệt.</p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {pendingTools.map(tool => (
                          <div key={tool._id} className="bg-foreground/[0.02] border border-card-border p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-foreground/[0.03] transition-all">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold">{tool.name}</h3>
                                <span className="bg-accent/10 text-accent text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">{tool.category}</span>
                              </div>
                              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{tool.description}</p>
                              <a href={tool.link} target="_blank" className="text-xs text-accent font-bold underline underline-offset-4 hover:opacity-80 transition-all">{tool.link}</a>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                              <button 
                                onClick={async () => {
                                  await handleApprove(tool._id);
                                  fetchStats();
                                  fetchPending();
                                }}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl hover:shadow-green-500/30 transition-all"
                              >
                                <CheckCircle2 size={18} /> Duyệt
                              </button>
                              <button 
                                onClick={async () => {
                                  await handleDelete(tool._id);
                                  fetchStats();
                                  fetchPending();
                                }}
                                className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                title="Từ chối/Xóa"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <motion.div 
                key="reviews"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="bg-card-bg border border-card-border rounded-[2.5rem] p-10 shadow-xl">
                  <div className="flex items-center gap-4 mb-12">
                     <div className="w-16 h-16 bg-accent/10 text-accent rounded-[1.5rem] flex items-center justify-center">
                        <MessageCircle size={32} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">Nhận xét từ người dùng</h2>
                        <p className="text-[var(--text-muted)]">Tổng hợp đánh giá cộng đồng ({statsData.totalReviews})</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.length === 0 ? (
                      <div className="col-span-full py-20 text-center text-[var(--text-muted)] font-medium">Chưa có nhận xét nào được gửi.</div>
                    ) : (
                      reviews.map((review: any, idx: number) => (
                        <div key={`${review._id}-${idx}`} className="bg-foreground/[0.02] border border-card-border p-6 rounded-[2rem] hover:border-accent/40 transition-all group">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-black text-sm uppercase">
                                {review.userName?.[0] || 'U'}
                              </div>
                              <div>
                                <h4 className="font-bold flex items-center gap-2">{review.userName || 'Ẩn danh'}</h4>
                                <div className="flex text-yellow-500 gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <button onClick={async () => {
                                await handleDeleteReview(review.toolId, review._id);
                                fetchStats();
                                fetchReviews(1);
                            }} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 bg-red-500/5 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <p className="text-sm text-foreground leading-relaxed italic mb-4">"{review.comment}"</p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-card-border/50">
                            <span className="text-[10px] font-black uppercase text-accent tracking-widest">{review.toolName}</span>
                            <span className="text-[10px] text-[var(--text-muted)] font-medium flex items-center gap-1">
                              <Calendar size={10} /> {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
