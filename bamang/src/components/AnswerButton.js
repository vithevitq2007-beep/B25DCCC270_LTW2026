import React from 'react';

const AnswerButton = ({
  letter,
  option,
  isSelected,
  isCorrect,
  isHidden,
  status,
  disabled,
  onClick,
}) => {
  if (isHidden) {
    return (
      <button
        type="button"
        className="answer-btn hidden-option"
        disabled={true}
        style={{ visibility: 'hidden', pointerEvents: 'none' }}
      />
    );
  }

  let buttonStyle = {};
  let buttonClass = 'answer-btn';

  if (status === 'locked' && isSelected) {
    buttonClass += ' locked-selected';
    buttonStyle = { backgroundColor: '#eab308', color: '#000000', borderColor: '#ca8a04' };
  } else if (status === 'revealed') {
    if (isCorrect) {
      buttonClass += ' revealed-correct';
      buttonStyle = { backgroundColor: '#22c55e', color: '#ffffff', borderColor: '#16a34a' };
    } else if (isSelected && !isCorrect) {
      buttonClass += ' revealed-wrong';
      buttonStyle = { backgroundColor: '#ef4444', color: '#ffffff', borderColor: '#dc2626' };
    }
  }

  return (
    <button
      type="button"
      className={buttonClass}
      style={buttonStyle}
      disabled={disabled}
      onClick={onClick}
    >
      {`${letter}. ${option}`}
    </button>
  );
};

export default AnswerButton;
