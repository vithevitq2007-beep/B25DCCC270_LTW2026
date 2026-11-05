import React from 'react';

const ProgressBar = ({ total = 15, currentIndex, results = [] }) => {
  const steps = Array.from({ length: total }, (_, i) => i);

  return (
    <div className="progress-bar">
      {steps.map((i) => {
        const stepNumber = i + 1;
        const res = results[i];
        const isCurrent = i === currentIndex;

        let stepClass = 'progress-step';
        let stepStyle = {};

        if (res === 'correct') {
          stepClass += ' step-correct';
          stepStyle = { backgroundColor: '#22c55e', color: '#ffffff' };
        } else if (res === 'wrong') {
          stepClass += ' step-wrong';
          stepStyle = { backgroundColor: '#ef4444', color: '#ffffff' };
        } else if (res === 'skipped') {
          stepClass += ' step-skipped';
          stepStyle = { backgroundColor: '#f97316', color: '#ffffff' };
        } else {
          stepClass += ' step-pending';
          stepStyle = { backgroundColor: '#94a3b8', color: '#ffffff' };
        }

        if (isCurrent) {
          stepClass += ' step-current';
          stepStyle.border = '3px solid #0f172a';
          stepStyle.fontWeight = 'bold';
        }

        return (
          <div
            key={i}
            className={stepClass}
            style={stepStyle}
          >
            {stepNumber}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
