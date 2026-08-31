import { createPinia, setActivePinia, storeToRefs } from 'pinia';

import { useContactsDatalistStore } from '../contactsDatalistStore';

describe('useContactsDatalistStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('exposes the configured columns', () => {
		const { headers } = storeToRefs(useContactsDatalistStore());

		const fields = headers.value.map((header) => header.field);
		expect(fields).toContain('name');
		expect(fields).toContain('labels');
	});

	it('starts with an empty, unloaded data list', () => {
		const store = useContactsDatalistStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
	});
});
