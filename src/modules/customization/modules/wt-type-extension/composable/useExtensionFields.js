import { computed, ref } from 'vue';

import WtTypeExtensionApi from '../api/wtTypeExtension.js';

export const useExtensionFields = ({ type }) => {
  const fields = ref([]);
  const isLoading = ref(false);

  const hasExtensionFields = computed(() => {
    return !isLoading.value && fields.value.length > 0;
  });

  const getFields = async () => {
    try {
      isLoading.value = true;
      const extension = await WtTypeExtensionApi.get({
        itemId: type,
      });

      fields.value = extension.fields;
    } catch {
      fields.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    fields,
    isLoading,
    hasExtensionFields,
    getFields,
  };
};
