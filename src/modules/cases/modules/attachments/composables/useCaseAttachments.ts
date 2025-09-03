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
  const currentStoreItems = computed(
    () => itemInstance.value?.[storePath] || [],
  );

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

  // Finds the index of an item in the array
  function findItemIndex(items, targetItem) {
    return items.findIndex((item) => {
      // Direct match
      if (item === targetItem) return true;

      // Compare by URL if available
      if (targetItem.url) {
        return item.name === targetItem.name && item.url === targetItem.url;
      }

      // Compare by basic properties
      return (
        item.name === targetItem.name &&
        item.size === targetItem.size &&
        item.mime === targetItem.mime
      );
    });
  }

  // deletes a single item from pending list
  async function deletePendingItem(itemToDelete) {
    const index = findItemIndex(pendingItems.value, itemToDelete);

    if (index === -1) return false;

    // Delete from both arrays
    pendingItems.value.splice(index, 1);
    currentStoreItems.value.splice(index, 1);

    await setItemProp({
      path: storePath,
      value: [...currentStoreItems.value],
    });

    return true;
  }

  // Updates existing item data
  async function updatePendingItem(oldItem, newItemData) {
    const index = findItemIndex(pendingItems.value, oldItem);

    if (index === -1) return false;

    // Update data in both arrays
    pendingItems.value[index] = newItemData;
    currentStoreItems.value[index] = { input: newItemData };

    await setItemProp({
      path: storePath,
      value: [...currentStoreItems.value],
    });

    return true;
  }

  // deletes multiple items at once
  async function deleteMultiplePendingItems(itemsToDelete) {
    // Convert to array
    const items = Array.isArray(itemsToDelete)
      ? itemsToDelete
      : [itemsToDelete];

    // Find indices to delete
    const indices = items
      .map((item) => findItemIndex(pendingItems.value, item))
      .filter((index) => index !== -1)
      .filter((index, pos, arr) => arr.indexOf(index) === pos) // unique indices
      .sort((a, b) => b - a); // sort from highest to lowest

    if (!indices.length) return false;

    // Delete items (starting from the end)
    indices.forEach((index) => {
      pendingItems.value.splice(index, 1);
      currentStoreItems.value.splice(index, 1);
    });

    await setItemProp({
      path: storePath,
      value: [...currentStoreItems.value],
    });

    return true;
  }

  return {
    isNew,
    pendingItems,
    isPendingItemsLoading,

    addNewItem,
    handleDeleteData,
    deletePendingItem,
    updatePendingItem,
    deleteMultiplePendingItems,
  };
}
