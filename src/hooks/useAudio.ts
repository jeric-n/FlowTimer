const startFocusSound = new Audio(process.env.PUBLIC_URL + '/sounds/Start_Focus.mp3');
const breakTimeSound = new Audio(process.env.PUBLIC_URL + '/sounds/Break_Time.mp3');
const endSessionSound = new Audio(process.env.PUBLIC_URL + '/sounds/End_Session.mp3');

export const useAudio = () => {
  const playStartFocusSound = () => {
    startFocusSound.play();
  };

  const playBreakTimeSound = () => {
    breakTimeSound.play();
  };

  const playEndSessionSound = () => {
    endSessionSound.play();
  };

  return {
    playStartFocusSound,
    playBreakTimeSound,
    playEndSessionSound,
  };
};
