import type { DatalistTableHeader } from '@webitel/ui-datalist';
import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

// Timeline is a grouped-by-day feed, not a real table — this header exists only
// to satisfy createTableStore's config; it's never rendered as a column.
export const headers: DatalistTableHeader[] = [
	{
		value: 'dayTimestamp',
		show: true,
		field: 'dayTimestamp',
		sort: SortSymbols.NONE,
	},
];
