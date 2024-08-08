import getNamespacedState
  from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import generateMediaURL from '../scripts/generateMediaURL.js';
import { useStore } from 'vuex';
import { computed } from 'vue';

export const usePlayMedia = (namespace) => {
  const store = useStore();

  const audioURL = computed(() => getNamespacedState(store.state, namespace).audioURL);
  const currentlyPlaying = computed(() => getNamespacedState(store.state, namespace).currentlyPlaying);

  const play = (value) => {
    if (value) {
      store.commit(`${namespace}/SET`, { path: 'currentlyPlaying', value });
      store.commit(`${namespace}/SET`, {
        path: 'audioURL',
        value: generateMediaURL(value),
      });
    } else {
      closePlayer();
    }
  };

  const closePlayer = () => {
    store.commit(`${namespace}/SET`, { path: 'audioURL', value: '' });
    store.commit(`${namespace}/SET`, { path: 'currentlyPlaying', value: '0' });
  };

  return {
    audioURL,
    currentlyPlaying,
    play,
    closePlayer,
  };
};
