'use client'

import styles from './Reels.module.css';
import dayjs from 'dayjs';

interface Props {
  vendorName: string;
}

export default function CalendarView({ vendorName }: Props) {
  const currentMonth = dayjs();
  const nextMonth = dayjs().add(1, 'month');

  return (
    <div className={styles.calendarContainer}>
      <h3 className={styles.calendarTitle}>📅 {vendorName} 마스터캘린더</h3>
      <div className={styles.calendarGrid}>
        <Calendar month={currentMonth} />
        <Calendar month={nextMonth} />
      </div>
    </div>
  );
}

function Calendar({ month }: { month: dayjs.Dayjs }) {
  const daysInMonth = month.daysInMonth();
  const label = month.format('YYYY년 MM월');
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={styles.calendar}>
      <div className={styles.monthLabel}>{label}</div>
      <div className={styles.days}>
        {days.map(day => (
          <div key={day} className={styles.day}>{day}</div>
        ))}
      </div>
    </div>
  );
}
