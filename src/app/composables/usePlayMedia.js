import { ref } from 'vue';
import generateMediaURL from '../scripts/generateMediaURL.js';

export const usePlayMedia = () => {
  const audioURL = ref('');
  const currentlyPlaying = ref('0');

  const play = (value) => {
    if (value) {
      currentlyPlaying.value = value;
      audioURL.value = generateMediaURL(value);
    } else {
      closePlayer();
    }
  };

  const closePlayer = () => {
    currentlyPlaying.value = '0';
    audioURL.value = '';
  };

  return {
    audioURL,
    currentlyPlaying,
    play,
    closePlayer,
  };
};
