'use client'

import styles from './Reels.module.css';
import { Step } from './stepData';

interface StepViewProps {
  vendorName: string;
  steps: Step[];
  onStepToggle: (stepId: string) => void;
}

export default function StepView({ vendorName, steps, onStepToggle }: StepViewProps) {
  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>📋 {vendorName} - 업무 프로세스</h2>
      <ul className={styles.stepList}>
        {steps.map((step) => (
          <li key={step.id} className={styles.stepItem}>
            <label className={styles.stepLabel}>
              <input
                type="checkbox"
                checked={step.completed}
                onChange={() => onStepToggle(step.id)}
              />
              <span className={step.completed ? styles.stepDone : ''}>
                {step.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
