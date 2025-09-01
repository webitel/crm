import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore.js';
import { ref, watch } from 'vue';

export function useCaseAttachments({
  cardNamespace,
  itemId,
  storePath,
  loadData,
  transformStoreItemToPending,
  processItemToAPI,
  deleteData,
}) {
  const { itemInstance, setItemProp } = useCardStore(cardNamespace);

  const { isNew } = useCardComponent({
    itemInstance,
    itemId,
  });

  const pendingItems = ref([]);
  const isSubmitting = ref(false);

  // Restore pending items from store for new cases
  if (isNew.value && itemInstance.value?.[storePath]) {
    const itemsFromStore = Array.isArray(itemInstance.value[storePath])
      ? itemInstance.value[storePath]
      : [itemInstance.value[storePath]];

    if (transformStoreItemToPending) {
      pendingItems.value = itemsFromStore.map(transformStoreItemToPending);
    }
  }

  // Watch for case save to process pending items
  watch(isNew, async (newIsNew, oldIsNew) => {
    if (oldIsNew === true && newIsNew === false && pendingItems.value.length) {
      await processPendingItems();
    }
  });

  async function processPendingItems() {
    try {
      isSubmitting.value = true;
      for (const item of pendingItems.value) {
        await processItemToAPI(item);
      }
      pendingItems.value = [];
      if (loadData) {
        await loadData();
      }
    } finally {
      isSubmitting.value = false;
    }
  }

  async function addNewItem(itemData, storeData) {
    if (isNew.value) {
      await handleNewCaseItem(itemData, storeData);
    } else {
      await handleExistingCaseItem(itemData);
    }
  }

  async function handleNewCaseItem(itemData, storeData) {
    // Add to pending items for UI
    addToPendingItems(itemData);
    // Add to store for persistence
    await addItemToStore(storeData);
  }

  async function handleExistingCaseItem(itemData) {
    try {
      isSubmitting.value = true;
      await processItemToAPI(itemData);
      if (loadData) {
        await loadData();
      }
    } finally {
      isSubmitting.value = false;
    }
  }

  function addToPendingItems(itemData) {
    pendingItems.value.push(itemData);
  }

  async function addItemToStore(storeData) {
    const existingItems = itemInstance.value?.[storePath] || [];
    await setItemProp({
      path: storePath,
      value: [...existingItems, storeData],
    });
  }

  async function handleDeleteData(itemsToDelete) {
    if (!isNew.value) {
      await deleteData(itemsToDelete);
    }
  }

  return {
    isNew,
    pendingItems,
    isSubmitting,

    addNewItem,
    handleDeleteData,
  };
}
