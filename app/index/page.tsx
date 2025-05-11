'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const departments = [
  { key: 'viral', label: '카페 바이럴', icon: '👩‍👧' },
  { key: 'reels', label: '릴스', icon: '🎬' },
  { key: 'review', label: '리얼리뷰', icon: '📣' },
  { key: 'etc', label: '기타', icon: '🗂' },
];

export default function MainPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('user');
    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      setLoggedIn(true);
    }
  }, []);

  if (loggedIn === null) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>로딩 중...</div>;
  }

  return (
    <div style={{ padding: '2rem', color: 'white', background: '#111', height: '100vh' }}>
      <h1>부서를 선택해주세요</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        {departments.map((dept) => (
          <div
            key={dept.key}
            onClick={() => router.push(`/main/${dept.key}`)}
            style={{
              border: '1px solid white',
              padding: '1rem',
              cursor: 'pointer',
              minWidth: '120px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dept.icon}</div>
            {dept.label}
          </div>
        ))}
      </div>
    </div>
  );
}
