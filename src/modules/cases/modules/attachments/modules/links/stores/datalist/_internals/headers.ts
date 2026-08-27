import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export const headers = [
	{
		value: 'name',
		show: true,
		sort: SortSymbols.NONE,
		field: 'name',
	},
	{
		value: 'createdBy',
		show: true,
		sort: SortSymbols.NONE,
		field: 'created_by',
	},
];
