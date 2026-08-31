import { createPinia, setActivePinia } from 'pinia';

import { useCaseCloseReasonGroupsCardStore } from '../caseCloseReasonGroupsCardStore';

describe('useCaseCloseReasonGroupsCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useCaseCloseReasonGroupsCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
