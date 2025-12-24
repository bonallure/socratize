import React from 'react';
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { Step } from '../types';
import styles from './StepTracker.module.css';

interface StepTrackerProps {
  steps: Step[];
}

const StepTracker: React.FC<StepTrackerProps> = ({ steps }) => {
  if (steps.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Learning Journey</h3>
      <div className={styles.stepList}>
        {steps.map((step, idx) => (
          <div key={step.id} className={styles.stepItem}>
            <div className={styles.iconWrapper}>
              <div className={`${styles.icon} ${
                step.status === 'completed' ? styles.completedIcon : 
                step.status === 'current' ? styles.currentIcon : ''
              }`}>
                {step.status === 'completed' ? <CheckCircle2 size={20} /> :
                 step.status === 'current' ? <PlayCircle size={20} /> : <Circle size={20} />}
              </div>
              {idx < steps.length - 1 && (
                <div className={`${styles.line} ${
                  step.status === 'completed' ? styles.completedLine : ''
                }`} />
              )}
            </div>
            <div>
              <p className={`${styles.label} ${
                step.status === 'completed' ? styles.completed : 
                step.status === 'current' ? styles.current : ''
              }`}>
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepTracker;
