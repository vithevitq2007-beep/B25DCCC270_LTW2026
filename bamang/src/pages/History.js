import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { formatScore } from '../data';

const History = ({
  history: propHistory,
  setHistory: propSetHistory,
}) => {
  const outletData = useOutletContext() || {};
  const history =
    propHistory !== undefined ? propHistory : outletData.history || [];
  const setHistory =
    propSetHistory || outletData.setHistory || (() => {});

  const handleClear = () => {
    setHistory([]);
    try {
      localStorage.removeItem('ltw_3mang_history');
    } catch (err) {
      console.error(err);
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="page history-page">
        <h2>Lịch sử các lượt chơi</h2>
        <p>Chưa có lượt chơi nào</p>
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.livesLeft - a.livesLeft;
  });

  const maxScore = history.reduce(
    (max, item) => (item.score > max ? item.score : max),
    0
  );

  const totalCorrect = history.reduce(
    (sum, item) => sum + (item.correctCount || 0),
    0
  );

  return (
    <div className="page history-page">
      <h2>Lịch sử các lượt chơi</h2>

      <div className="history-summary">
        <p>{`Số lượt chơi: ${history.length}`}</p>
        <p>{`Điểm cao nhất: ${formatScore(maxScore)}`}</p>
        <p>{`Tổng số câu trả lời đúng: ${totalCorrect}`}</p>
      </div>

      <button
        type="button"
        onClick={handleClear}
        className="clear-history-btn"
      >
        Xóa lịch sử
      </button>

      <table className="history-table">
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Mạng còn lại</th>
            <th>Điểm</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.correctCount}</td>
              <td>{item.livesLeft}</td>
              <td>{formatScore(item.score)}</td>
              <td>{item.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
