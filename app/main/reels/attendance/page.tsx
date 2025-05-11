'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AttendancePage from '../../_shared/AttendancePage';
import dayjs from 'dayjs';

export default function AttendanceWrapper() {
  const { department } = useParams();
  const today = dayjs().format('YYYY-MM-DD');
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`attendance:${department}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.attendance?.[today]) {
        setCheckedIn(true);
      }
    }
  }, [department, today]);

  const handleCheckIn = () => {
    const saved = localStorage.getItem(`attendance:${department}`);
    let parsed = saved ? JSON.parse(saved) : { attendance: {}, memos: {} };
    parsed.attendance[today] = true;
    localStorage.setItem(`attendance:${department}`, JSON.stringify(parsed));
    setCheckedIn(true);
  };

  if (checkedIn) {
    return <AttendancePage department={department as string} />;
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        {department}팀 출근 준비
      </h2>
      <button
        onClick={handleCheckIn}
        style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#4ade80',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        ✅ 출근하기
      </button>
    </div>
  );
}
