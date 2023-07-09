import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

// eslint-disable-next-line import/prefer-default-export
export const useAccess = () => {
  const store = useStore();
  const route = useRoute();

  const hasCreateAccess = computed(() => store.getters['userinfo/HAS_CREATE_ACCESS']({ name: 'cc_audit_form' }));
  const hasEditAccess = computed(() => store.getters['userinfo/HAS_EDIT_ACCESS']({ name: 'cc_audit_form' }));
  const hasDeleteAccess = computed(() => store.getters['userinfo/HAS_DELETE_ACCESS']({ name: 'cc_audit_form' }));

  /*
  hasModifyAccess depends on route meta param and wraps access logic to show if inputs should be disabled
   */
  const hasModifyAccess = computed(() => {
    const modifyMode = route.meta.modifyMode;
    if (modifyMode === 'edit') return hasEditAccess.value;
    if (modifyMode === 'create') return hasCreateAccess.value;
    return false;
  });
  return {
    hasCreateAccess,
    hasEditAccess,
    hasDeleteAccess,

    hasModifyAccess,
  };
};
