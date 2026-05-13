import React from 'react';
import PetalEffect from './components/PetalEffect';
import FullPageScroll from './components/FullPageScroll';
import HomePage from './pages/HomePage';
import PhotoPage from './pages/PhotoPage';
import InfoPage from './pages/InfoPage';
import GuestBookPage from './pages/GuestBookPage';
import EndPage from './pages/EndPage';
import './App.css';

function App() {
  return (
    <div className="w-100 h-vh-100 overflow-hidden relative">
      <PetalEffect />
      <FullPageScroll>
        <HomePage />
        <PhotoPage />
        <InfoPage />
        <GuestBookPage />
        <EndPage />
      </FullPageScroll>
    </div>
  );
}

export default App;
