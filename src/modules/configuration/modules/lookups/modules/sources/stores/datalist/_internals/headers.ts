import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export const headers = [
	{
		value: 'name',
		locale: 'reusable.name',
		show: true,
		field: 'name',
		sort: SortSymbols.NONE,
	},
	{
		value: 'type',
		locale: 'vocabulary.type',
		show: true,
		field: 'type',
		sort: SortSymbols.NONE,
	},
	{
		value: 'description',
		locale: 'vocabulary.description',
		show: true,
		field: 'description',
		sort: SortSymbols.NONE,
	},
];
