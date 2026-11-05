import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatScore } from '../data';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page result-page">
      <h2>{state.reason}</h2>

      <div className="result-details">
        <p>{`Người chơi: ${state.name || state.playerName || ''}`}</p>
        <p>{`Số câu trả lời đúng: ${state.correctCount ?? 0}`}</p>
        <p>{`Số mạng còn lại: ${state.livesLeft ?? 0}`}</p>
        <p>{`Điểm: ${formatScore(state.score ?? 0)}`}</p>
      </div>

      <div className="result-buttons">
        <button
          type="button"
          onClick={() => navigate('/play')}
          className="btn-replay"
        >
          Chơi lại
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-home"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Result;
