import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';

// eslint-disable-next-line import/prefer-default-export
export const useCardPage = (namespace) => {
  const router = useRouter();
  const route = useRoute();

  const {
    id,
    itemInstance,

    loadItem,
    addItem,
    updateItem,
    setId,
    resetState,
    setItemProp,
  } = useCardStore(namespace);

  function redirectToEdit() {
    const routeName = route.name.replace('-new', '-edit');
    return router.replace({
      name: routeName,
      params: { id: id.value },
      hash: route.hash,
    });
  }

  async function save() {
    if (id.value) {
      await updateItem();
    } else {
      try {
        await addItem();
        if (id.value) {
          await redirectToEdit();
        }
      } catch (err) {
        throw err;
      }
    }
  }

  async function initializeCard() {
    const { id: itemId } = route.params;
    await setId(itemId);
    return loadItem();
  }

  onMounted(() => initializeCard());
  onUnmounted(() => resetState());

  return {
    id,
    itemInstance,

    save,
    setId,
    setItemProp,
  };
};
