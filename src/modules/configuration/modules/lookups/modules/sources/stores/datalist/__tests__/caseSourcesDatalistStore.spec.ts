import { createPinia, setActivePinia, storeToRefs } from 'pinia';

import { useCaseSourcesDatalistStore } from '../caseSourcesDatalistStore';

describe('useCaseSourcesDatalistStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('exposes the configured columns', () => {
		const { headers } = storeToRefs(useCaseSourcesDatalistStore());

		const fields = headers.value.map((header) => header.field);
		expect(fields).toEqual([
			'name',
			'type',
			'description',
		]);
	});

	it('starts with an empty, unloaded data list', () => {
		const store = useCaseSourcesDatalistStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
	});
});
