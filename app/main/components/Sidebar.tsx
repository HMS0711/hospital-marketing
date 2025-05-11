'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isReels = pathname.includes('/reels');
  const basePath = pathname.split('/').slice(0, 3).join('/');

  return (
    <aside className={styles.sidebar}>
      {/* YM COMPANY 상단 고정 */}
      <h2
        className={styles.logo}
        onClick={() => router.push('/')}
        style={{ cursor: 'pointer' }}
      >
        YM COMPANY
      </h2>

      {/* 릴스 부서 전용 메뉴 */}
      {isReels && (
        <>
          <h3 className={styles.section}>🎬 릴스</h3>
          <ul className={styles.menu}>
            <li className={styles.menuItem}>업체 A</li>
            <li className={styles.menuItem}>업체 B</li>
            <li className={styles.menuItem}>종료된 업체</li>
          </ul>
        </>
      )}

      {/* ✅ 고정 메뉴: 항상 출력 */}
      <hr className={styles.divider} />
      <ul className={styles.menu}>
        <li
          className={styles.menuItem}
          onClick={() => router.push(`${basePath}/attendance`)}
        >
          📝 출근
        </li>
        <li
          className={styles.menuItem}
          onClick={() => router.push(`${basePath}/goals`)}
        >
          🎯 목표
        </li>
        <li
          className={styles.menuItem}
          onClick={() => router.push(`${basePath}/meeting`)}
        >
          🗓️ 회의
        </li>
      </ul>
    </aside>
  );
}
