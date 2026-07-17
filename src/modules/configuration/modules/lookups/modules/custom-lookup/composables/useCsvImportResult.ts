import type { DataBatchCreateDatasetResponse } from '@webitel/api-services/gen/models';
import { snakeToCamel } from '@webitel/api-services/utils';
import type { EventBus } from '@webitel/ui-sdk/composables';
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import {
	buildCsvImportNotifications,
	createEmptyCsvImportResult,
	mergeCsvImportChunk,
} from '../utils/csvImportResult';

// accumulate chunked import results and show notifications
export const useCsvImportResult = () => {
	const { t, te } = useI18n();
	const eventBus = inject<EventBus>('$eventBus');

	const importResult = ref<DataBatchCreateDatasetResponse | null>(null);
	const rowOffset = ref(0);

	const addChunk = (
		chunk: DataBatchCreateDatasetResponse,
		rowsCount: number,
	) => {
		importResult.value = mergeCsvImportChunk(
			importResult.value ?? createEmptyCsvImportResult(),
			chunk,
			rowOffset.value,
		);
		rowOffset.value += rowsCount;
	};

	// BE snake_case code -> camelCase locale key, or raw code if missing
	const translateErrorCode = (code = '') => {
		if (!code) return '';
		const key = `customization.customLookups.import.codes.${snakeToCamel(code)}`;
		return te(key) ? t(key) : code;
	};

	const notify = () => {
		if (!eventBus) return;

		const notifications = buildCsvImportNotifications(importResult.value);

		for (const {
			type,
			messageKey,
			messageParams,
			errorCode,
		} of notifications) {
			eventBus.$emit('notification', {
				type,
				text: t(messageKey, {
					...messageParams,
					...(errorCode !== undefined && {
						code: translateErrorCode(errorCode),
					}),
				}),
			});
		}
	};

	const reset = () => {
		importResult.value = null;
		rowOffset.value = 0;
	};

	return {
		addChunk,
		notify,
		reset,
	};
};
