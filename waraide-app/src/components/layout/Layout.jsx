import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="wa-app">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
