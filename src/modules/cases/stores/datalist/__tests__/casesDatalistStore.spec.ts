import { createPinia, setActivePinia, storeToRefs } from 'pinia';

import { useCasesDatalistStore } from '../casesDatalistStore';

describe('useCasesDatalistStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('exposes the configured columns', () => {
		const { headers } = storeToRefs(useCasesDatalistStore());

		const fields = headers.value.map((header) => header.field);
		expect(fields).toContain('name');
		expect(fields).toContain('subject');
		expect(fields).toContain('priority');
		expect(fields).toContain('status_condition');
	});

	it('starts with an empty, unloaded data list', () => {
		const store = useCasesDatalistStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
	});
});
