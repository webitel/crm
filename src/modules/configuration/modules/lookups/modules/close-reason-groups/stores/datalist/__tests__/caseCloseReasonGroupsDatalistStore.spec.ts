import { createPinia, setActivePinia, storeToRefs } from 'pinia';

import { useCaseCloseReasonGroupsDatalistStore } from '../caseCloseReasonGroupsDatalistStore';

describe('useCaseCloseReasonGroupsDatalistStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('exposes the configured columns', () => {
		const { headers } = storeToRefs(useCaseCloseReasonGroupsDatalistStore());

		const fields = headers.value.map((header) => header.field);
		expect(fields).toEqual([
			'name',
			'description',
		]);
	});

	it('starts with an empty, unloaded data list', () => {
		const store = useCaseCloseReasonGroupsDatalistStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
	});
});
