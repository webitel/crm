import type {
	DataBatchCreateDatasetResponse,
	DataBatchCreateError,
} from '@webitel/api-services/gen/models';
import type { EventBus } from '@webitel/ui-sdk/composables';
import type { ComposerTranslation } from 'vue-i18n';

/** Show at most this many per-row error notifications, the rest are folded into one. */
const MAX_ERROR_NOTIFICATIONS = 5;

/** Row 0 of the parsed data is line 2 in the file (line 1 is the header). */
const HEADER_LINES_COUNT = 1;

export const createEmptyCsvImportResult =
	(): DataBatchCreateDatasetResponse => ({
		total: 0,
		imported: 0,
		failed: 0,
		errors: [],
	});

/**
 * The file is imported in chunks, but the user should see one overall result.
 * Adds one chunk response to the running totals.
 *
 * API error.row is an index inside the chunk (0, 1, 2...).
 * rowOffset = how many rows were already sent in previous chunks,
 * so we convert it to an index in the whole file.
 */
export const mergeCsvImportChunk = (
	result: DataBatchCreateDatasetResponse,
	chunk: DataBatchCreateDatasetResponse,
	rowOffset: number,
): DataBatchCreateDatasetResponse => {
	const chunkErrors = chunk.errors || [];
	const errors: DataBatchCreateError[] = [
		...(result.errors || []),
	];

	for (const error of chunkErrors) {
		const rowInChunk = error.row || 0;
		errors.push({
			...error,
			row: rowInChunk + rowOffset,
		});
	}

	return {
		total: (result.total || 0) + (chunk.total || 0),
		imported: (result.imported || 0) + (chunk.imported || 0),
		failed: (result.failed || 0) + (chunk.failed || 0),
		errors,
	};
};

const translateErrorCode = (t: ComposerTranslation, code = '') => {
	if (!code) return '';
	const key = `customization.customLookups.import.codes.${code}`;
	const translation = t(key);
	// vue-i18n returns the key itself when there is no translation
	return translation === key ? code : translation;
};

/**
 * Shows the import outcome as notifications:
 * 1. summary ("Imported X of Y records"),
 * 2. one error notification per failed row (up to MAX_ERROR_NOTIFICATIONS),
 * 3. one folded notification for the remaining errors, if any.
 */
export const notifyCsvImportResult = ({
	result,
	t,
	eventBus,
}: {
	result: DataBatchCreateDatasetResponse | null;
	t: ComposerTranslation;
	eventBus?: EventBus | null;
}) => {
	if (!result || !eventBus) return;

	const total = result.total || 0;
	const imported = result.imported || 0;
	const failed = result.failed || 0;
	const errors = result.errors || [];

	if (total > 0) {
		const isCompleteFailure = imported === 0 && failed > 0;
		eventBus.$emit('notification', {
			type: isCompleteFailure ? 'error' : 'info',
			text: t('customization.customLookups.import.summary', {
				imported,
				total,
				failed,
			}),
		});
	}

	const shownErrors = errors.slice(0, MAX_ERROR_NOTIFICATIONS);
	const hiddenErrorsCount = errors.length - shownErrors.length;

	for (const error of shownErrors) {
		eventBus.$emit('notification', {
			type: 'error',
			text: t('customization.customLookups.import.rowError', {
				record: (error.row || 0) + HEADER_LINES_COUNT + 1, // file line number
				field: error.field || '',
				value: error.value || '',
				code: translateErrorCode(t, error.code),
			}),
		});
	}

	if (hiddenErrorsCount > 0) {
		eventBus.$emit('notification', {
			type: 'error',
			text: t('customization.customLookups.import.moreErrors', {
				count: hiddenErrorsCount,
			}),
		});
	}
};
