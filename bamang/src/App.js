const BUILD_TAG = "tm-6852";
/* eslint-disable import/first */
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import './App.css';

export { BUILD_TAG };

export const handleFilterShift = (e, setter) => {
  if (setter) setter(e.target.value);
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          return;
        }
        setError('Không tải được câu hỏi');
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            loading={loading}
            error={error}
            questions={questions}
            playerName={playerName}
            setPlayerName={setPlayerName}
            history={history}
            setHistory={setHistory}
          />
        }
      >
        <Route index element={<Home />} />
        <Route path="play" element={<h2>Màn hình chơi</h2>} />
        <Route path="result" element={<h2>Kết quả lượt chơi</h2>} />
        <Route path="history" element={<h2>Lịch sử các lượt chơi</h2>} />
        <Route
          path="questions"
          element={<QuestionBank questions={questions} />}
        />
        <Route
          path="questions/:id"
          element={<QuestionDetail questions={questions} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
