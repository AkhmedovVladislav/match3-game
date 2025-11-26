import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LeaderboardEntry {
  name: string;
  time: number; 
  difficulty: string;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
}

const saved = localStorage.getItem('leaderboard');
const initialState: LeaderboardState = {
  entries: saved ? JSON.parse(saved) : [],
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    addEntry(state, action: PayloadAction<LeaderboardEntry>) {
      state.entries.push(action.payload);
      state.entries.sort((a, b) => a.time - b.time); 
      localStorage.setItem('leaderboard', JSON.stringify(state.entries));
    },
    setEntries(state, action: PayloadAction<LeaderboardEntry[]>) {
      state.entries = action.payload;
      localStorage.setItem('leaderboard', JSON.stringify(state.entries));
    },
  },
});

export const { addEntry, setEntries } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
