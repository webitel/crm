import { computed, ref, watch } from 'vue';

export function useCaseAttachments({
	itemInstance,
	isNew,
	storePath,
	loadData,
	transformStoreItemToPending,
	processItemToAPI,
	deleteData,
}: {
	itemInstance: {
		value: Record<string, any>;
	};
	isNew: {
		value: boolean;
	};
	storePath: string;
	loadData?: () => Promise<unknown>;
	transformStoreItemToPending?: (item: any) => any;
	processItemToAPI: (item: any) => Promise<unknown>;
	deleteData: (items: any) => Promise<unknown>;
}) {
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
				: [
						currentStoreItems.value,
					];

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
		pendingItems.value.push(itemData);
		itemInstance.value[storePath] = [
			...currentStoreItems.value,
			storeData,
		];
	}

	async function handleExistingCaseItem(itemData) {
		await processItemsToAPI([
			itemData,
		]);
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

			// Extract comparison conditions into variables
			const isTargetName = item.name === targetItem.name;
			const isTargetUrl = item.url === targetItem.url;
			const isTargetSize = item.size === targetItem.size;
			const isTargetMime = item.mime === targetItem.mime;

			// Compare by URL if available
			if (targetItem.url) {
				return isTargetName && isTargetUrl;
			}

			// Compare by basic properties
			return isTargetName && isTargetSize && isTargetMime;
		});
	}

	function saveToStore() {
		itemInstance.value[storePath] = [
			...currentStoreItems.value,
		];
	}

	// Helper method to find and validate item index
	function findValidItemIndex(item) {
		const index = findItemIndex(pendingItems.value, item);
		return index !== -1 ? index : null;
	}

	// deletes a single item from pending list
	async function deletePendingItem(itemToDelete) {
		const index = findValidItemIndex(itemToDelete);
		if (index === null) return;

		// Delete from both arrays
		pendingItems.value.splice(index, 1);
		currentStoreItems.value.splice(index, 1);

		saveToStore();
	}

	// Updates existing item data
	async function updatePendingItem(oldItem, newItemData) {
		const index = findValidItemIndex(oldItem);
		if (index === null) return;

		// Update data in both arrays
		pendingItems.value[index] = newItemData;
		currentStoreItems.value[index] = {
			input: newItemData,
		};

		saveToStore();
	}

	// deletes multiple items at once
	async function deleteMultiplePendingItems(itemsToDelete) {
		// Convert to array
		const items = Array.isArray(itemsToDelete)
			? itemsToDelete
			: [
					itemsToDelete,
				];

		// Find valid indices to delete
		const indices = items
			.map((item) => findItemIndex(pendingItems.value, item))
			.filter((index) => index !== -1)
			.filter((index, pos, arr) => arr.indexOf(index) === pos) // unique indices
			.sort((a, b) => b - a); // sort from highest to lowest

		if (!indices.length) return;

		// Delete items (starting from the end)
		indices.forEach((index) => {
			pendingItems.value.splice(index, 1);
			currentStoreItems.value.splice(index, 1);
		});

		saveToStore();
	}

	return {
		pendingItems,
		isPendingItemsLoading,

		addNewItem,
		handleDeleteData,
		deletePendingItem,
		updatePendingItem,
		deleteMultiplePendingItems,
	};
}
