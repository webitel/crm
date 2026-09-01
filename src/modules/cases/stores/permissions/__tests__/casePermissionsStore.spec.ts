import { createPinia, setActivePinia, storeToRefs } from 'pinia';

import { useCasePermissionsStore } from '../casePermissionsStore';

describe('useCasePermissionsStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts with an empty, unloaded data list and no parent set', () => {
		const store = useCasePermissionsStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
		expect(store.parentId).toBeUndefined();
	});

	it('$reset clears data back to the initial state', () => {
		const store = useCasePermissionsStore();
		const { dataList, isLoading } = storeToRefs(store);

		dataList.value.push({
			grantee: {
				id: '1',
			},
		});
		isLoading.value = true;

		store.$reset();

		expect(dataList.value).toEqual([]);
		expect(isLoading.value).toBe(false);
	});
});
