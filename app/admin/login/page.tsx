'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
        router.refresh(); // Refresh to update middleware state
      } else {
        setError(data.error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" />
      
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-card-bg border border-card-border p-8 rounded-[2rem] shadow-2xl relative z-10 transition-all hover:border-accent/30">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-[var(--text-muted)] text-sm">Vui lòng xác thực danh tính</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-foreground/[0.03] border rounded-xl px-4 py-3.5 outline-none transition-all ${
                error ? 'border-red-500 focus:border-red-500' : 'border-card-border focus:border-accent'
              }`}
              placeholder="Nhập mã bí mật..."
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs font-bold flex items-center gap-1 animate-in slide-in-from-top-1">
                <AlertCircle size={12} /> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-accent text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Truy cập <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-[var(--text-muted)] font-medium">
        &copy; 2026 AI Directory Admin System
      </p>
    </main>
  );
}
