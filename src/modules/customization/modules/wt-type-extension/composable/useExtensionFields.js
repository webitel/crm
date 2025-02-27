import { ref } from 'vue';

import WtTypeExtensionApi from '../api/wtTypeExtension.js';

export const useExtensionFields = ({ type }) => {
  const fields = ref([]);

  const getFields = async () => {
    try {
      const extension = await WtTypeExtensionApi.get({
        itemId: type,
      });

      fields.value = extension.fields;
    } catch {
      fields.value = [];
    }
  };

  return {
    fields,
    getFields,
  };
};
