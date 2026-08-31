import { createPinia, setActivePinia, storeToRefs } from 'pinia';

import { useCasePrioritiesDatalistStore } from '../casePrioritiesDatalistStore';

describe('useCasePrioritiesDatalistStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('exposes the configured columns', () => {
		const { headers } = storeToRefs(useCasePrioritiesDatalistStore());

		const fields = headers.value.map((header) => header.field);
		expect(fields).toEqual([
			'name',
			'color',
			'description',
		]);
	});

	it('starts with an empty, unloaded data list', () => {
		const store = useCasePrioritiesDatalistStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
	});
});
