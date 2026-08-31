import { createPinia, setActivePinia } from 'pinia';

import { useCaseSourcesCardStore } from '../caseSourcesCardStore';

describe('useCaseSourcesCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useCaseSourcesCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
