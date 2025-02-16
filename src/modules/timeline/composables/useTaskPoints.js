import { computed } from 'vue';
import { useStore } from 'vuex';

export const useTaskPoints = ({ taskId, namespace }) => {

  const store = useStore();

  const points = computed(() => {
    return store.getters[`${namespace}/GET_HISTORY_BY_ID`](taskId);
  });

  function loadHistory() {
    return store.dispatch(`${namespace}/LOAD_HISTORY`, { taskId });
  }

  if (!points.value) {
    loadHistory();
  }

  return {
    points,
  };
};
