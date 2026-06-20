import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Splash from './pages/Splash.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Search from './pages/Search.jsx';
import Result from './pages/Result.jsx';
import Map from './pages/Map.jsx';
import Stations from './pages/Stations.jsx';
import AddEstablishment from './pages/AddEstablishment.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes sans Layout (pas de barre de navigation) */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes avec Layout */}
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/result"
          element={
            <Layout>
              <Result />
            </Layout>
          }
        />
        <Route
          path="/map"
          element={
            <Layout>
              <Map />
            </Layout>
          }
        />
        <Route
          path="/stations"
          element={
            <Layout>
              <Stations />
            </Layout>
          }
        />
        <Route
          path="/add-establishment"
          element={
            <Layout>
              <AddEstablishment />
            </Layout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
