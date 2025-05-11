'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './components/Sidebar'; // ✅ 공통 사이드바 경로로 변경

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showSidebar = pathname.startsWith('/main/'); // 모든 부서에서 사이드바 표시

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {showSidebar && <Sidebar />} {/* ✅ 더 이상 props 필요 없음 */}
      <div style={{ flex: 1, background: '#111' }}>{children}</div>
    </div>
  );
}
