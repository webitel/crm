import { createPinia, setActivePinia, storeToRefs } from 'pinia';

import { useCaseSlasDatalistStore } from '../caseSlasDatalistStore';

describe('useCaseSlasDatalistStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('exposes the configured columns', () => {
		const { headers } = storeToRefs(useCaseSlasDatalistStore());

		const fields = headers.value.map((header) => header.field);
		expect(fields).toEqual([
			'name',
			'description',
			'calendar',
		]);
	});

	it('starts with an empty, unloaded data list', () => {
		const store = useCaseSlasDatalistStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
	});
});
