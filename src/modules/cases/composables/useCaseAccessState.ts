import { storeToRefs } from 'pinia';
import { computed, inject } from 'vue';

import { useCasesCardStore } from '../stores/card/casesCardStore';
import { useCasesEditModeStore } from '../stores/card/casesEditModeStore';

export function useCaseAccessState() {
	const casesCardstore = useCasesCardStore();
	const { itemId } = storeToRefs(casesCardstore);

	const casesEditModeStore = useCasesEditModeStore();
	const { isEditMode } = storeToRefs(casesEditModeStore);

	const isEditable = computed(() => !itemId.value || isEditMode.value);
	const isReadOnly = inject<boolean>('isReadOnly');

	return {
		isEditable,
		isReadOnly,
	};
}
