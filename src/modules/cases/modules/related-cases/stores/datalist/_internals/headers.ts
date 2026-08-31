import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export const headers = [
	{
		value: 'name',
		show: true,
		sort: SortSymbols.NONE,
		field: 'related_case',
		width: '140px',
	},
	{
		value: 'subject',
		show: true,
		sort: SortSymbols.NONE,
	},
	{
		value: 'relationType',
		show: true,
		sort: SortSymbols.NONE,
		field: 'relation',
	},
];
