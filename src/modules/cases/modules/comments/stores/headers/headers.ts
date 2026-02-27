import {
	SortSymbols,
	SortMode,
} from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export const headers = [
	{
		value: 'content',
		show: true,
		sort: SortSymbols.NONE,
		field: 'text',
	},
	{
		value: 'createdAt',
		show: false,
		sort: SortSymbols.DESC,
		sortMode: SortMode.ASC_DESC,
		field: 'created_at',
	},
];
