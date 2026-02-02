import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'AI Hub | Tổng hợp công cụ AI hàng đầu',
  description: 'Khám phá và so sánh các công cụ AI tốt nhất cho công việc và sáng tạo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="glow-mesh" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
