import { type StoreGeneric, storeToRefs } from 'pinia';
import { computed, inject } from 'vue';

import { useCasesCardStore } from '../stores/card/casesCardStore';
import { useCasesEditModeStore } from '../stores/card/casesEditModeStore';

export function useCaseAccessState() {
	const { itemId } = storeToRefs(
		useCasesCardStore() as unknown as StoreGeneric,
	);
	const { isEditMode } = storeToRefs(useCasesEditModeStore());

	const isEditable = computed(() => !itemId.value || isEditMode.value);
	const isReadOnly = inject<boolean>('isReadOnly');

	return {
		isEditable,
		isReadOnly,
	};
}
