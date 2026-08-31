import {
	buildCsvImportNotifications,
	createEmptyCsvImportResult,
	mergeCsvImportChunk,
} from '../csvImportResult';

describe('createEmptyCsvImportResult', () => {
	it('returns all-zero result', () => {
		expect(createEmptyCsvImportResult()).toEqual({
			total: 0,
			imported: 0,
			failed: 0,
			errors: [],
		});
	});
});

describe('mergeCsvImportChunk', () => {
	it('sums counters and shifts chunk-local error rows by the offset', () => {
		const prev = {
			total: 10,
			imported: 8,
			failed: 2,
			errors: [
				{
					row: 0,
					field: 'name',
				},
			],
		};
		const chunk = {
			total: 5,
			imported: 4,
			failed: 1,
			errors: [
				{
					row: 1,
					field: 'email',
				},
			],
		};

		const merged = mergeCsvImportChunk(prev, chunk, 10);

		expect(merged).toEqual({
			total: 15,
			imported: 12,
			failed: 3,
			errors: [
				{
					row: 0,
					field: 'name',
				},
				{
					row: 11,
					field: 'email',
				},
			],
		});
	});

	it('treats a missing previous result as empty', () => {
		const merged = mergeCsvImportChunk(
			{},
			{
				total: 3,
				imported: 3,
				failed: 0,
			},
			0,
		);

		expect(merged).toEqual({
			total: 3,
			imported: 3,
			failed: 0,
			errors: [],
		});
	});
});

describe('buildCsvImportNotifications', () => {
	it('returns nothing for an empty/missing result', () => {
		expect(buildCsvImportNotifications()).toEqual([]);
		expect(buildCsvImportNotifications(null)).toEqual([]);
	});

	it('reports a complete failure as an error notification', () => {
		const notifications = buildCsvImportNotifications({
			total: 2,
			imported: 0,
			failed: 2,
			errors: [],
		});

		expect(notifications).toEqual([
			{
				type: 'error',
				messageKey: 'customization.customLookups.import.summary',
				messageParams: {
					importedCount: 0,
					totalCount: 2,
					failedCount: 2,
				},
			},
		]);
	});

	it('reports a partial success as an info notification', () => {
		const [summary] = buildCsvImportNotifications({
			total: 2,
			imported: 1,
			failed: 1,
			errors: [],
		});

		expect(summary.type).toBe('info');
	});

	it('caps per-row error notifications and folds the rest into one overflow notification', () => {
		const errors = Array.from(
			{
				length: 7,
			},
			(_, i) => ({
				row: i,
				field: 'name',
				value: `v${i}`,
				code: 'lookup.not_found',
			}),
		);

		const notifications = buildCsvImportNotifications({
			total: 7,
			imported: 0,
			failed: 7,
			errors,
		});

		// 1 summary + 5 capped row errors + 1 overflow notification
		expect(notifications).toHaveLength(7);
		expect(
			notifications.filter((n) => n.messageKey.includes('rowError')),
		).toHaveLength(5);

		const overflow = notifications.at(-1);
		expect(overflow.messageKey).toBe(
			'customization.customLookups.import.moreErrors',
		);
		expect(overflow.messageParams).toEqual({
			count: 2,
		});
	});
});
