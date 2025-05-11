// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'YM COMPANY',
  description: '부서 선택 시스템',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-zinc-900 text-white font-sans">
        {children}
      </body>
    </html>
  );
}
