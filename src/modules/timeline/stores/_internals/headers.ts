import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

// Timeline is a grouped-by-day feed, not a real table — this header exists only
// to satisfy createTableStore's config; it's never rendered as a column.
export const headers = [
	{
		value: 'dayTimestamp',
		show: true,
		sort: SortSymbols.NONE,
	},
];
