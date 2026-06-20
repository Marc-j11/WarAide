import React from 'react';
import Navbar from './Navbar.jsx';

export default function Layout({ children }) {
  return (
    <div className="wa-app">
      <div className="wa-phone">
        <div className="wa-content">{children}</div>
        <Navbar />
      </div>
    </div>
  );
}
