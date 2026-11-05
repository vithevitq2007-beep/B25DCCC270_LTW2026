import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { LEVELS, POINTS, formatScore } from '../data';

const QuestionBank = ({ questions = [] }) => {
  const navigate = useNavigate();
  const outletData = useOutletContext();
  const allQuestions =
    questions && questions.length > 0
      ? questions
      : outletData?.questions || [];

  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterShift = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredQuestions = allQuestions.filter((q) => {
    const matchLevel =
      selectedLevel === 'all' ||
      selectedLevel === '' ||
      selectedLevel === 'Tất cả' ||
      String(q.level) === String(selectedLevel) ||
      LEVELS[q.level] === selectedLevel;

    const matchSearch = q.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchLevel && matchSearch;
  });

  const handleRandomQuestion = () => {
    if (filteredQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const randomQuestion = filteredQuestions[randomIndex];
    navigate(`/questions/${randomQuestion.id}`);
  };

  return (
    <div className="page question-bank-page">
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filter-controls">
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="level-select"
        >
          <option value="all">Tất cả</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm theo nội dung..."
          value={searchTerm}
          onChange={handleFilterShift}
          className="search-input"
        />

        <button
          type="button"
          onClick={handleRandomQuestion}
          disabled={filteredQuestions.length === 0}
          className="random-btn"
        >
          Câu ngẫu nhiên
        </button>
      </div>

      <p className="question-count">Có {filteredQuestions.length} câu hỏi</p>

      <table className="questions-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Điểm</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q, index) => (
            <tr key={q.id}>
              <td>{index + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{formatScore(POINTS[q.level])}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
