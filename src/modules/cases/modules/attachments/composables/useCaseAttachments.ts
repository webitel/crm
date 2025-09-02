import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore.js';
import { ref, watch, computed } from 'vue';

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
  const isPendingItemsLoading = ref(false);

  // Get current items from store path
  const currentStoreItems = computed(() => itemInstance.value?.[storePath] || []);

  // Restore pending items from store for new cases
  function restorePendingItems() {
    if (isNew.value && currentStoreItems.value.length) {
      const itemsFromStore = Array.isArray(currentStoreItems.value)
        ? currentStoreItems.value
        : [currentStoreItems.value];

      if (transformStoreItemToPending) {
        pendingItems.value = itemsFromStore.map(transformStoreItemToPending);
      }
    }
  }

  // Call restoration function during initialization
  restorePendingItems();

  // Watch for case save to process pending items
  watch(isNew, async (newVal, oldVal) => {
    if (oldVal && !newVal && pendingItems.value.length) {
      await processPendingItems();
    }
  });

  async function processItemsToAPI(items) {
    try {
      isPendingItemsLoading.value = true;
      await Promise.all(items.map((item) => processItemToAPI(item)));
      if (loadData) {
        await loadData();
      }
    } finally {
      isPendingItemsLoading.value = false;
    }
  }

  async function processPendingItems() {
    await processItemsToAPI(pendingItems.value);
    pendingItems.value = [];
  }

  async function addNewItem(itemData, storeData) {
    await (isNew.value
      ? handleNewCaseItem(itemData, storeData)
      : handleExistingCaseItem(itemData));
  }

  async function handleNewCaseItem(itemData, storeData) {
    // Add to pending items for UI
    pendingItems.value.push(itemData);
    // Add to store for persistence
    await setItemProp({
      path: storePath,
      value: [...currentStoreItems.value, storeData],
    });
  }

  async function handleExistingCaseItem(itemData) {
    await processItemsToAPI([itemData]);
  }

  async function handleDeleteData(itemsToDelete) {
    if (!isNew.value) {
      await deleteData(itemsToDelete);
    }
  }

  return {
    isNew,
    pendingItems,
    isPendingItemsLoading,

    addNewItem,
    handleDeleteData,
  };
}
