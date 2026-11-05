import React from 'react';
import { formatScore } from '../data';

const StatusBar = ({ timeLeft, lives, score, streak }) => {
  return (
    <div className="status-bar">
      <div
        className={`status-row ${timeLeft <= 15 ? 'time-warning' : ''}`}
        style={timeLeft <= 15 ? { color: 'red', fontWeight: 'bold' } : undefined}
      >
        {`Thời gian: ${timeLeft} giây`}
      </div>

      <div className="status-row status-lives">
        {`Mạng: ${lives} `}
        {Array.from({ length: Math.max(0, lives) }, (_, i) => (
          <span key={i} className="heart-icon">
            ❤
          </span>
        ))}
      </div>

      <div className="status-row">
        {`Điểm: ${formatScore(score)}`}
      </div>

      <div className="status-row">
        {`Chuỗi đúng: ${streak}`}
      </div>
    </div>
  );
};

export default StatusBar;
