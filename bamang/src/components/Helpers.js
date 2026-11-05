import React from 'react';
import { MAX_LIVES } from '../data';

const Helpers = ({
  onFiftyFifty,
  onSkip,
  onExtraLife,
  usedHelpers,
  lives,
  status,
}) => {
  const isAnswering = status === 'answering';

  return (
    <div className="helpers-container">
      <button
        type="button"
        onClick={onFiftyFifty}
        disabled={!isAnswering || usedHelpers.fiftyFifty}
        className="helper-btn helper-5050"
      >
        50:50
      </button>

      <button
        type="button"
        onClick={onSkip}
        disabled={!isAnswering || usedHelpers.skip}
        className="helper-btn helper-skip"
      >
        Bỏ qua
      </button>

      <button
        type="button"
        onClick={onExtraLife}
        disabled={!isAnswering || usedHelpers.extraLife || lives >= MAX_LIVES}
        className="helper-btn helper-extra-life"
      >
        Thêm 1 mạng
      </button>
    </div>
  );
};

export default Helpers;
