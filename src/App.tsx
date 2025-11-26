import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import FinalScreenPage from './pages/FinalScreenPage';
import Rules from './pages/Rules';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SettingsPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/final" element={<FinalScreenPage />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </Router>
  );
};

export default App;