import React from 'react';
import AnswerButton from './AnswerButton';
import { LETTERS, LEVELS, POINTS, formatScore } from '../data';

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  hiddenOptions = [],
  status,
  onSelectAnswer,
}) => {
  if (!question) return null;

  return (
    <div className="question-card">
      <div className="card-header">
        {`Câu ${questionNumber}/${totalQuestions} · ${LEVELS[question.level]} · ${formatScore(
          POINTS[question.level]
        )}`}
      </div>

      <p className="card-question-text">{question.question}</p>

      <div className="answers-grid">
        {question.options.map((option, index) => (
          <AnswerButton
            key={index}
            letter={LETTERS[index]}
            option={option}
            isSelected={selectedAnswer === index}
            isCorrect={index === question.answer}
            isHidden={hiddenOptions.includes(index)}
            status={status}
            disabled={status !== 'answering'}
            onClick={() => onSelectAnswer(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
