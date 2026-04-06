import React from 'react';
import { BookOpenCheck } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">Java Full Stack Final Assessment</h1>
        <div className="header-logo">
          <BookOpenCheck size={32} />
        </div>
      </div>
    </header>
  );
};

export default Header;
