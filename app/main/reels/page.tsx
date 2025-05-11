'use client';

import { useState } from 'react';
import styles from './Reels.module.css';
import dayjs from 'dayjs';
import StepView from './StepView';
import CalendarView from './CalendarView';
import { generateInitialSteps, Step } from './stepData';

type Vendor = {
  name: string;
  steps: Step[];
};

export default function ReelsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([
    { name: '업체 A', steps: generateInitialSteps() },
    { name: '업체 B', steps: generateInitialSteps() },
  ]);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const handleStepToggle = (stepId: string) => {
    if (!selectedVendor) return;

    const updatedVendors = vendors.map((vendor) =>
      vendor.name === selectedVendor.name
        ? {
            ...vendor,
            steps: vendor.steps.map((step) =>
              step.id === stepId
                ? { ...step, completed: !step.completed }
                : step
            ),
          }
        : vendor
    );

    setVendors(updatedVendors);
    const updatedSelected =
      updatedVendors.find((v) => v.name === selectedVendor.name) || null;
    setSelectedVendor(updatedSelected);
  };

  return (
    <main className={styles.main}>
      {selectedVendor ? (
        <div className={styles.splitLayout}>
          <div className={styles.leftColumn}>
            <CalendarView vendorName={selectedVendor.name} />
          </div>
          <div className={styles.rightColumn}>
            <StepView
              vendorName={selectedVendor.name}
              steps={selectedVendor.steps}
              onStepToggle={handleStepToggle}
            />
          </div>
        </div>
      ) : (
        <>
          <h1 className={styles.heading}>릴스팀 마스터 캘린더</h1>
          <div className={styles.calendarGrid}>
            <Calendar month={dayjs()} />
            <Calendar month={dayjs().add(1, 'month')} />
          </div>
        </>
      )}
    </main>
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
        {days.map((day) => (
          <div key={day} className={styles.day}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
