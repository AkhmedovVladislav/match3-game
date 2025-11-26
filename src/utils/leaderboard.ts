export type LeaderboardEntry = {
    name:string;
    time:number;
    difficulty: 'easy' | 'medium' |'hard';
};

export const getLeaderboard = (): LeaderboardEntry[] => {
    const data = localStorage.getItem('leaderboard')

    return data ? JSON.parse(data): [];
};

export const saveLeaderboard = (entires: LeaderboardEntry[]) => {
    localStorage.setItem('leaderboard', JSON.stringify(entires.slice(0,10)));
};

export const addLeaderboardEntry = (entry: LeaderboardEntry) => {
  const leaderboard = getLeaderboard();
  leaderboard.push(entry);
  leaderboard.sort((a,b) => a.time - b.time);
  saveLeaderboard(leaderboard);
};
