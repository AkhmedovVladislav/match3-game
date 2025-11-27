export const startSnowfall = (container: HTMLDivElement) => {
  const interval = setInterval(() => {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.textContent = '❄️';
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.animationDuration = `${4 + Math.random() * 4}s`;
    flake.style.opacity = String(0.8 + Math.random() * 0.2);
    flake.style.fontSize = `${15 + Math.random() * 20}px`;
    container.appendChild(flake);
    setTimeout(() => flake.remove(), 8000);
  }, 150);

  return () => clearInterval(interval); 
};
