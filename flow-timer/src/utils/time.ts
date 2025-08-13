export const formatTime = (timeInMs: number): string => {
  const seconds = Math.floor((timeInMs / 1000) % 60);
  const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
  const hours = Math.floor((timeInMs / (1000 * 60 * 60)) % 24);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
