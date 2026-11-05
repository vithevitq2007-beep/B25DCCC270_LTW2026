import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const getNavStyle = ({ isActive }) => {
    return isActive
      ? { backgroundColor: '#7c3aed', color: '#ffffff' }
      : undefined;
  };

  return (
    <nav className="navbar">
      <NavLink
        to="/"
        end
        style={getNavStyle}
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        Trang chủ
      </NavLink>
      <NavLink
        to="/questions"
        style={getNavStyle}
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        Ngân hàng câu hỏi
      </NavLink>
      <NavLink
        to="/history"
        style={getNavStyle}
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        Lịch sử
      </NavLink>
    </nav>
  );
};

export default NavBar;
