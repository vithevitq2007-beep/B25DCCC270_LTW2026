import React from 'react';
import { Link, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { LETTERS, LEVELS, POINTS, formatScore } from '../data';

const QuestionDetail = ({ questions = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const outletData = useOutletContext();
  const allQuestions =
    questions && questions.length > 0
      ? questions
      : outletData?.questions || [];

  const numId = Number(id);
  const question = allQuestions.find((q) => q.id === numId);

  if (!question) {
    return (
      <div className="page question-detail-page">
        <p className="not-found-message">Không tìm thấy câu hỏi</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const prevQuestion = allQuestions.find((q) => q.id === numId - 1);
  const nextQuestion = allQuestions.find((q) => q.id === numId + 1);

  return (
    <div className="page question-detail-page">
      <h2>
        {`Câu hỏi số ${question.id} (${LEVELS[question.level]} · ${formatScore(
          POINTS[question.level]
        )})`}
      </h2>

      <p className="question-content">{question.question}</p>

      <ul className="answers-list">
        {question.options.map((option, index) => {
          const isCorrect = index === question.answer;
          return (
            <li
              key={index}
              className={`answer-item ${isCorrect ? 'correct-answer' : ''}`}
              style={isCorrect ? { backgroundColor: '#4ade80' } : undefined}
            >
              {`${LETTERS[index]}. ${option}${
                isCorrect ? ' (Đáp án đúng)' : ''
              }`}
            </li>
          );
        })}
      </ul>

      <div className="navigation-actions">
        {prevQuestion && (
          <Link
            to={`/questions/${prevQuestion.id}`}
            className="prev-link"
          >
            ← Câu trước
          </Link>
        )}
        {nextQuestion && (
          <Link
            to={`/questions/${nextQuestion.id}`}
            className="next-link"
          >
            Câu sau →
          </Link>
        )}
      </div>

      <div className="back-action">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;
