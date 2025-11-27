export const spawnConfetti = (container: HTMLDivElement) => {
  if (!container) return;

  const confettiCount = 15;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * container.offsetWidth}px`;
    confetti.style.top = `0px`;
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;

    const duration = 1 + Math.random() * 1.5;
    confetti.style.animationDuration = `${duration}s`;

    container.appendChild(confetti);
    setTimeout(() => confetti.remove(), duration * 1000);
  }
};
