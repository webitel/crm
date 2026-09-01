import { createPinia, setActivePinia } from 'pinia';

import { useCasesEditModeStore } from '../casesEditModeStore';

describe('useCasesEditModeStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts out of edit mode', () => {
		const store = useCasesEditModeStore();

		expect(store.isEditMode).toBe(false);
	});

	it('setEditMode toggles the flag', () => {
		const store = useCasesEditModeStore();

		store.setEditMode(true);
		expect(store.isEditMode).toBe(true);

		store.setEditMode(false);
		expect(store.isEditMode).toBe(false);
	});

	it('$reset clears edit mode back to false', () => {
		const store = useCasesEditModeStore();

		store.setEditMode(true);
		store.$reset();

		expect(store.isEditMode).toBe(false);
	});
});
