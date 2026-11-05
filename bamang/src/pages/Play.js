import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Navigate, useOutletContext } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import StatusBar from '../components/StatusBar';
import ProgressBar from '../components/ProgressBar';
import { TOTAL_TIME, MAX_LIVES } from '../data';
import { calcScore, calcStreak } from '../utils';

const Play = ({ playerName: propPlayerName, questions: propQuestions }) => {
  const navigate = useNavigate();
  const outletData = useOutletContext() || {};

  const playerName =
    propPlayerName !== undefined ? propPlayerName : outletData.playerName || '';

  const questions = useMemo(() => {
    return propQuestions && propQuestions.length > 0
      ? propQuestions
      : outletData.questions || [];
  }, [propQuestions, outletData.questions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [lives, setLives] = useState(MAX_LIVES);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [status, setStatus] = useState('answering'); // "answering" | "locked" | "revealed"
  const [results, setResults] = useState([]);

  // Use refs to avoid stale closures in setTimeout callbacks
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

  // 1. Clock timer: runs only when status === "answering"
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

  // 2. Timeout handler: triggers when timeLeft reaches 0
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
  }, [timeLeft, navigate]);

  // 3. Step transitions using useEffect watching status
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

        // Check if out of lives
        if (!isCorrect && newLives <= 0) {
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

        // Check if finished all questions
        if (curIdx + 1 >= curQuestions.length) {
          const reason =
            correctCount === curQuestions.length
              ? 'Xuất sắc! Bạn đã trả lời đúng cả 15 câu'
              : 'Bạn đã hoàn thành thử thách';

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

        // Advance to next question
        setResults(newResults);
        if (!isCorrect) {
          setLives(newLives);
        }
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setStatus('answering');
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, navigate]);

  // Prevent direct access without player name
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

  const handleSelectAnswer = (index) => {
    if (status !== 'answering') return;
    setSelectedAnswer(index);
    setStatus('locked');
  };

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

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        status={status}
        onSelectAnswer={handleSelectAnswer}
      />
    </div>
  );
};

export default Play;
