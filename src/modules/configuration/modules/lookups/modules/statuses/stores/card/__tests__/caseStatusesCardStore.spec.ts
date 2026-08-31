import { createPinia, setActivePinia } from 'pinia';

import { useCaseStatusesCardStore } from '../caseStatusesCardStore';

describe('useCaseStatusesCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useCaseStatusesCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
