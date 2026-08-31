import { createPinia, setActivePinia, storeToRefs } from 'pinia';

import { useCaseServiceCatalogsDatalistStore } from '../caseServiceCatalogsDatalistStore';

describe('useCaseServiceCatalogsDatalistStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('exposes the configured columns', () => {
		const { headers } = storeToRefs(useCaseServiceCatalogsDatalistStore());

		const fields = headers.value.map((header) => header.field);
		expect(fields).toContain('name');
		expect(fields).toContain('sla');
		expect(fields).toContain('status');
	});

	it('starts with an empty, unloaded data list', () => {
		const store = useCaseServiceCatalogsDatalistStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
	});
});
