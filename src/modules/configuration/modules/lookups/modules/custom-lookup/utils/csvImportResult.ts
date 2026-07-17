import type {
	DataBatchCreateDatasetResponse,
	DataBatchCreateError,
} from '@webitel/api-services/gen/models';

// max per-row error toasts; the rest go into one overflow toast
const MAX_ERROR_NOTIFICATIONS = 5;

// row 0 in data = line 2 in the file (line 1 is the header)
const HEADER_LINES_COUNT = 1;

export type CsvImportNotification = {
	type: 'info' | 'error';
	messageKey: string;
	messageParams: Record<string, unknown>;
	// raw BE code, e.g. "lookup.not_found"
	errorCode?: string;
};

// fill optional API fields with defaults
const normalizeCsvImportResult = (
	result: DataBatchCreateDatasetResponse,
): Required<DataBatchCreateDatasetResponse> => ({
	total: result.total ?? 0,
	imported: result.imported ?? 0,
	failed: result.failed ?? 0,
	errors: result.errors ?? [],
});

export const createEmptyCsvImportResult =
	(): Required<DataBatchCreateDatasetResponse> => normalizeCsvImportResult({});

// shift chunk-local error.row by rowOffset to a file-wide index
const mergeCsvImportErrors = (
	prevErrors: DataBatchCreateError[],
	chunkErrors: DataBatchCreateError[],
	rowOffset: number,
): DataBatchCreateError[] => [
	...prevErrors,
	...chunkErrors.map((error) => ({
		...error,
		row: (error.row ?? 0) + rowOffset,
	})),
];

// merge one chunk into the running import result
export const mergeCsvImportChunk = (
	result: DataBatchCreateDatasetResponse,
	chunk: DataBatchCreateDatasetResponse,
	rowOffset: number,
): Required<DataBatchCreateDatasetResponse> => {
	const prev = normalizeCsvImportResult(result);
	const next = normalizeCsvImportResult(chunk);

	return {
		total: prev.total + next.total,
		imported: prev.imported + next.imported,
		failed: prev.failed + next.failed,
		errors: mergeCsvImportErrors(prev.errors, next.errors, rowOffset),
	};
};

// build notification descriptors (no i18n / eventBus here)
export const buildCsvImportNotifications = (
	result?: DataBatchCreateDatasetResponse | null,
): CsvImportNotification[] => {
	if (!result) return [];

	const { total, imported, failed, errors } = normalizeCsvImportResult(result);
	const notifications: CsvImportNotification[] = [];

	if (total > 0) {
		const isCompleteFailure = imported === 0 && failed > 0;
		notifications.push({
			type: isCompleteFailure ? 'error' : 'info',
			messageKey: 'customization.customLookups.import.summary',
			messageParams: {
				importedCount: imported,
				totalCount: total,
				failedCount: failed,
			},
		});
	}

	const shownErrors = errors.slice(0, MAX_ERROR_NOTIFICATIONS);
	const hiddenErrorsCount = errors.length - shownErrors.length;

	for (const error of shownErrors) {
		notifications.push({
			type: 'error',
			messageKey: 'customization.customLookups.import.rowError',
			messageParams: {
				record: (error.row ?? 0) + HEADER_LINES_COUNT + 1, // file line number
				field: error.field || '',
				value: error.value || '',
			},
			errorCode: error.code,
		});
	}

	if (hiddenErrorsCount > 0) {
		notifications.push({
			type: 'error',
			messageKey: 'customization.customLookups.import.moreErrors',
			messageParams: {
				count: hiddenErrorsCount,
			},
		});
	}

	return notifications;
};
