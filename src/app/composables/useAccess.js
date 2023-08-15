import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

// eslint-disable-next-line import/prefer-default-export
export const useAccess = () => {
  const store = useStore();
  const route = useRoute();

  const hasCreateAccess = computed(() => store.getters['userinfo/HAS_CREATE_ACCESS']({ name: 'contacts' }));
  const hasDeleteAccess = computed(() => store.getters['userinfo/HAS_DELETE_ACCESS']({ name: 'contacts' }));
  const hasEditAccess = computed(() => store.getters['userinfo/HAS_EDIT_ACCESS']({ name: 'contacts' }));

  return {
    hasCreateAccess,
    hasEditAccess,
    hasDeleteAccess,
  };
};
