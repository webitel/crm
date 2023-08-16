import { computed } from 'vue';
import { useStore } from 'vuex';

// eslint-disable-next-line import/prefer-default-export
export const useAccess = () => {
  const store = useStore();

  const hasObacCreateAccess = computed(() => store.getters['userinfo/HAS_CREATE_ACCESS']({ name: 'contacts' }));
  const hasObacDeleteAccess = computed(() => store.getters['userinfo/HAS_DELETE_ACCESS']({ name: 'contacts' }));
  const hasObacEditAccess = computed(() => store.getters['userinfo/HAS_EDIT_ACCESS']({ name: 'contacts' }));

  return {
    hasObacCreateAccess,
    hasObacDeleteAccess,
    hasObacEditAccess,
  };
};
