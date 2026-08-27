import { defineStore } from 'pinia';
import { ref } from 'vue';

import { CasesCardNamespace } from '../../namespace';

export const useCasesEditModeStore = defineStore(
	`${CasesCardNamespace}/editMode`,
	() => {
		const isEditMode = ref(false);

		function setEditMode(value: boolean) {
			isEditMode.value = value;
		}

		function $reset() {
			isEditMode.value = false;
		}

		return {
			isEditMode,
			setEditMode,
			$reset,
		};
	},
);
