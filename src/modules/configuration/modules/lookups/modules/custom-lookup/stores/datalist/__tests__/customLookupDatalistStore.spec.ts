import { createPinia, setActivePinia } from 'pinia';

import { useCustomLookupDatalistStore } from '../customLookupDatalistStore';

describe('useCustomLookupDatalistStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('seeds no static columns (schema is built at runtime per dictionary)', () => {
		const store = useCustomLookupDatalistStore();

		expect(store.headers).toEqual([]);
	});

	it('starts with an empty, unloaded data list', () => {
		const store = useCustomLookupDatalistStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
	});
});
