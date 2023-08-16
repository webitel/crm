import { computed } from 'vue';
import { useStore } from 'vuex';

// eslint-disable-next-line import/prefer-default-export
export const useAccess = () => {
  const store = useStore();

  const hasObacCreateAccess = computed(() => store.getters['userinfo/HAS_CREATE_ACCESS']({ name: 'contacts' }));
  const hasObacDeleteAccess = computed(() => store.getters['userinfo/HAS_DELETE_ACCESS']({ name: 'contacts' }));
  const hasObacEditAccess = computed(() => store.getters['userinfo/HAS_EDIT_ACCESS']({ name: 'contacts' }));

  // FIXME: useAccess composable SHOULDN'T KNOW DIRECT NAMESPACE PATH TO ITEM_INSTANCE
  const itemInstance = computed(() => store.state.contacts.card.itemInstance);
  const hasRbacEditAccess = computed(() => itemInstance.value?.access?.edit);
  const hasRbacDeleteAccess = computed(() => itemInstance.value?.access?.delete);

  return {
    hasObacCreateAccess,
    hasObacDeleteAccess,
    hasObacEditAccess,

    hasRbacEditAccess,
    hasRbacDeleteAccess,
  };
};
