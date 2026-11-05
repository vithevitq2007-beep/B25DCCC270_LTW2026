import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Navigate, useOutletContext } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import StatusBar from '../components/StatusBar';
import ProgressBar from '../components/ProgressBar';
import Helpers from '../components/Helpers';
import { TOTAL_TIME, MAX_LIVES } from '../data';
import { calcScore, calcStreak } from '../utils';

const Play = ({
  playerName: propPlayerName,
  questions: propQuestions,
  addHistoryRecord: propAddHistory,
}) => {
  const navigate = useNavigate();
  const outletData = useOutletContext() || {};
  const outletSetHistory = outletData.setHistory;

  const playerName =
    propPlayerName !== undefined ? propPlayerName : outletData.playerName || '';

  const questions = useMemo(() => {
    return propQuestions && propQuestions.length > 0
      ? propQuestions
      : outletData.questions || [];
  }, [propQuestions, outletData.questions]);

  const addHistoryRecord = useCallback(
    (record) => {
      if (propAddHistory) {
        propAddHistory(record);
      } else if (outletSetHistory) {
        outletSetHistory((prev) => [record, ...prev]);
      }
    },
    [propAddHistory, outletSetHistory]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [lives, setLives] = useState(MAX_LIVES);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [status, setStatus] = useState('answering');
  const [results, setResults] = useState([]);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [usedHelpers, setUsedHelpers] = useState({
    fiftyFifty: false,
    skip: false,
    extraLife: false,
  });

  const stateRef = useRef({
    currentIndex,
    lives,
    results,
    questions,
    playerName,
    selectedAnswer,
  });

  useEffect(() => {
    stateRef.current = {
      currentIndex,
      lives,
      results,
      questions,
      playerName,
      selectedAnswer,
    };
  }, [currentIndex, lives, results, questions, playerName, selectedAnswer]);

  useEffect(() => {
    document.title = `Câu ${currentIndex + 1}/${questions.length} – còn ${lives} mạng`;

    return () => {
      document.title = 'Thử thách 3 mạng';
    };
  }, [currentIndex, questions.length, lives]);

  useEffect(() => {
    if (status !== 'answering') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [status]);

  useEffect(() => {
    if (timeLeft === 0) {
      const {
        results: curResults,
        questions: curQuestions,
        playerName: curPlayerName,
        lives: curLives,
      } = stateRef.current;
      const finalScore = calcScore(curResults, curQuestions);
      const correctCount = curResults.filter((r) => r === 'correct').length;

      const record = {
        id: Date.now(),
        name: curPlayerName,
        score: finalScore,
        correctCount: correctCount,
        livesLeft: curLives,
        playedAt: new Date().toLocaleString('vi-VN'),
      };
      addHistoryRecord(record);

      navigate('/result', {
        replace: true,
        state: {
          name: curPlayerName,
          score: finalScore,
          correctCount: correctCount,
          livesLeft: curLives,
          reason: 'Hết giờ!',
        },
      });
    }
  }, [timeLeft, navigate, addHistoryRecord]);

  useEffect(() => {
    let timer;

    if (status === 'locked') {
      timer = setTimeout(() => {
        setStatus('revealed');
      }, 1000);
    } else if (status === 'revealed') {
      timer = setTimeout(() => {
        const {
          currentIndex: curIdx,
          lives: curLives,
          results: curResults,
          questions: curQuestions,
          playerName: curPlayerName,
          selectedAnswer: curAns,
        } = stateRef.current;

        const currentQ = curQuestions[curIdx];
        if (!currentQ) return;

        const isCorrect = curAns === currentQ.answer;
        const outcome = isCorrect ? 'correct' : 'wrong';
        const newResults = [...curResults, outcome];
        const newLives = isCorrect ? curLives : curLives - 1;
        const finalScore = calcScore(newResults, curQuestions);
        const correctCount = newResults.filter((r) => r === 'correct').length;

        if (!isCorrect && newLives <= 0) {
          const record = {
            id: Date.now(),
            name: curPlayerName,
            score: finalScore,
            correctCount: correctCount,
            livesLeft: 0,
            playedAt: new Date().toLocaleString('vi-VN'),
          };
          addHistoryRecord(record);

          navigate('/result', {
            replace: true,
            state: {
              name: curPlayerName,
              score: finalScore,
              correctCount: correctCount,
              livesLeft: 0,
              reason: 'Bạn đã hết mạng',
            },
          });
          return;
        }

        if (curIdx + 1 >= curQuestions.length) {
          const reason =
            correctCount === curQuestions.length
              ? 'Xuất sắc! Bạn đã trả lời đúng cả 15 câu'
              : 'Bạn đã hoàn thành thử thách';

          const record = {
            id: Date.now(),
            name: curPlayerName,
            score: finalScore,
            correctCount: correctCount,
            livesLeft: newLives,
            playedAt: new Date().toLocaleString('vi-VN'),
          };
          addHistoryRecord(record);

          navigate('/result', {
            replace: true,
            state: {
              name: curPlayerName,
              score: finalScore,
              correctCount: correctCount,
              livesLeft: newLives,
              reason: reason,
            },
          });
          return;
        }

        setResults(newResults);
        if (!isCorrect) {
          setLives(newLives);
        }
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setHiddenOptions([]);
        setStatus('answering');
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, navigate, addHistoryRecord]);

  const handleSelectAnswer = useCallback(
    (index) => {
      if (status !== 'answering') return;
      setSelectedAnswer(index);
      setStatus('locked');
    },
    [status]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'answering') return;

      const keyMap = {
        a: 0,
        A: 0,
        b: 1,
        B: 1,
        c: 2,
        C: 2,
        d: 3,
        D: 3,
      };

      const index = keyMap[e.key];
      if (index !== undefined) {
        if (hiddenOptions.includes(index)) return;
        handleSelectAnswer(index);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [status, hiddenOptions, handleSelectAnswer]);

  const handleFiftyFifty = () => {
    if (status !== 'answering' || usedHelpers.fiftyFifty) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.answer);
    const shuffled = [...wrongIndices].sort(() => 0.5 - Math.random());
    const toHide = shuffled.slice(0, 2);

    setHiddenOptions(toHide);
    setUsedHelpers((prev) => ({ ...prev, fiftyFifty: true }));
  };

  const handleSkip = () => {
    if (status !== 'answering' || usedHelpers.skip) return;
    setUsedHelpers((prev) => ({ ...prev, skip: true }));
    setHiddenOptions([]);

    const newResults = [...results, 'skipped'];
    const finalScore = calcScore(newResults, questions);
    const correctCount = newResults.filter((r) => r === 'correct').length;

    if (currentIndex + 1 >= questions.length) {
      const record = {
        id: Date.now(),
        name: playerName,
        score: finalScore,
        correctCount: correctCount,
        livesLeft: lives,
        playedAt: new Date().toLocaleString('vi-VN'),
      };
      addHistoryRecord(record);

      navigate('/result', {
        replace: true,
        state: {
          name: playerName,
          score: finalScore,
          correctCount: correctCount,
          livesLeft: lives,
          reason: 'Bạn đã hoàn thành thử thách',
        },
      });
      return;
    }

    setResults(newResults);
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setStatus('answering');
  };

  const handleExtraLife = () => {
    if (
      status !== 'answering' ||
      usedHelpers.extraLife ||
      lives >= MAX_LIVES
    ) {
      return;
    }
    setLives((prev) => Math.min(MAX_LIVES, prev + 1));
    setUsedHelpers((prev) => ({ ...prev, extraLife: true }));
  };

  if (!playerName || !playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="page play-page">
        <p className="loading-state">Đang tải câu hỏi...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentScore = calcScore(results, questions);
  const currentStreak = calcStreak(results);

  return (
    <div className="page play-page">
      <StatusBar
        timeLeft={timeLeft}
        lives={lives}
        score={currentScore}
        streak={currentStreak}
      />

      <ProgressBar
        total={questions.length}
        currentIndex={currentIndex}
        results={results}
      />

      <Helpers
        onFiftyFifty={handleFiftyFifty}
        onSkip={handleSkip}
        onExtraLife={handleExtraLife}
        usedHelpers={usedHelpers}
        lives={lives}
        status={status}
      />

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        hiddenOptions={hiddenOptions}
        status={status}
        onSelectAnswer={handleSelectAnswer}
      />
    </div>
  );
};

export default Play;
