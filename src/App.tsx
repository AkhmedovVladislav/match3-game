import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import FinalScreenPage from './pages/FinalScreenPage';
import Rules from './pages/Rules';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SettingsPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/final" element={<FinalScreenPage />} />
      <Route path="/rules" element={<Rules />} />
    </Routes>
  );
};

export default App;
