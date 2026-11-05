import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Home = ({ playerName: propName, setPlayerName: propSetName }) => {
  const navigate = useNavigate();
  const outletData = useOutletContext() || {};
  const playerName =
    propName !== undefined ? propName : outletData.playerName || '';
  const setPlayerName =
    propSetName || outletData.setPlayerName || (() => {});

  const handleStart = (e) => {
    e.preventDefault();
    if (playerName && playerName.trim()) {
      navigate('/play');
    }
  };

  return (
    <div className="page home-page">
      <h2>Thử thách 3 mạng</h2>

      <div className="rules-summary">
        <p><strong>Luật chơi:</strong></p>
        <ul>
          <li>Trả lời lần lượt 15 câu hỏi về kiến thức Lập trình Web.</li>
          <li>Bạn có <strong>3 mạng</strong> và tổng cộng <strong>90 giây</strong> cho toàn bộ lượt chơi.</li>
          <li>Trả lời đúng được cộng điểm theo mức độ câu hỏi (Dễ: 100, Trung bình: 200, Khó: 300).</li>
          <li>Từ câu đúng thứ 3 liên tiếp trở đi, mỗi câu đúng được thưởng thêm <strong>50 điểm</strong>.</li>
          <li>Trả lời sai mất 1 mạng và chuỗi đúng trở về 0, nhưng vẫn tiếp tục sang câu tiếp theo.</li>
          <li>Lượt chơi kết thúc khi hoàn thành 15 câu, hết mạng hoặc hết giờ.</li>
        </ul>
      </div>

      <form onSubmit={handleStart} className="player-form">
        <div className="form-group">
          <label htmlFor="playerName">Tên người chơi:</label>
          <input
            id="playerName"
            type="text"
            placeholder="Nhập tên của bạn..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="player-name-input"
          />
        </div>

        <button
          type="submit"
          disabled={!playerName || !playerName.trim()}
          className="start-btn"
        >
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;
