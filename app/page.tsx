'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Main.module.css';

const departments = [
  { key: 'viral', label: '카페 바이럴', icon: '👩‍👧' },
  { key: 'reels', label: '릴스', icon: '🎬' },
  { key: 'review', label: '리얼리뷰', icon: '📣' },
  { key: 'etc', label: '기타', icon: '🗂' },
];

export default function MainPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('user');
    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return null; // 리디렉션 전엔 아무것도 보여주지 않음

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>YM COMPANY</h2>
        <p className={styles.hint}>부서를 선택해주세요</p>
      </aside>

      <main className={styles.main}>
        <h1 className={styles.heading}>부서를 선택해주세요</h1>
        <div className={styles.cardGrid}>
          {departments.map((dept) => (
            <div
              key={dept.key}
              className={styles.card}
              onClick={() => router.push(`/main/${dept.key}`)}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {dept.icon}
              </div>
              {dept.label}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
