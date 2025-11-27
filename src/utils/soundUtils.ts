export const playButtonClickSound = (volume = 0.4) => {
  const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/button.mp3`);
  audio.volume = volume;
  audio.play().catch(() => {});
};