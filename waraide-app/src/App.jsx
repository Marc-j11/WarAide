import React from 'react';
import AppRoutes from './routes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StationProvider } from './context/StationContext.jsx';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <StationProvider>
        <AppRoutes />
      </StationProvider>
    </AuthProvider>
  );
}
