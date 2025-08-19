const startFocusSound = new Audio(process.env.PUBLIC_URL + '/sounds/Start_Focus.mp3');
const breakTimeSound = new Audio(process.env.PUBLIC_URL + '/sounds/Break_Time.mp3');
const endSessionSound = new Audio(process.env.PUBLIC_URL + '/sounds/End_Session.mp3');

export const useAudio = () => {
  const playStartFocusSound = () => {
    try {
      startFocusSound.play();
    } catch (error) {
      console.error("Error playing start focus sound:", error);
    }
  };

  const playBreakTimeSound = () => {
    try {
      breakTimeSound.play();
    } catch (error) {
      console.error("Error playing break time sound:", error);
    }
  };

  const playEndSessionSound = () => {
    try {
      endSessionSound.play();
    } catch (error) {
      console.error("Error playing end session sound:", error);
    }
  };

  return {
    playStartFocusSound,
    playBreakTimeSound,
    playEndSessionSound,
  };
};
