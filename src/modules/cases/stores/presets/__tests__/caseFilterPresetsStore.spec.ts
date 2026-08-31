import { createPinia, setActivePinia } from 'pinia';

import { useCaseFilterPresetsStore } from '../caseFilterPresetsStore';

describe('useCaseFilterPresetsStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts with no preset selected and an empty data list', () => {
		const store = useCaseFilterPresetsStore();

		expect(store.presetId).toBeNull();
		expect(store.dataList).toEqual([]);
	});
});
