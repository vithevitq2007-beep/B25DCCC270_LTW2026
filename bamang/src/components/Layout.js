import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error, questions }) => {
  return (
    <div className="layout">
      <NavBar />
      <main className="main-content">
        {loading ? (
          <div className="loading-state">Đang tải câu hỏi...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <Outlet context={{ questions, loading, error }} />
        )}
      </main>
    </div>
  );
};

export default Layout;
