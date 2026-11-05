import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page not-found-page">
      <h2>404 - Không tìm thấy trang</h2>
      <Link to="/" className="home-link">
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
