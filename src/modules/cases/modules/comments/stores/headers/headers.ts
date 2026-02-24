import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export const headers = [
	{
		value: 'createdAt',
		show: false,
		sort: SortSymbols.DESC,
		field: 'created_at',
	},
	{
		value: 'content',
		show: true,
		sort: SortSymbols.NONE,
		field: 'text',
	},
];
