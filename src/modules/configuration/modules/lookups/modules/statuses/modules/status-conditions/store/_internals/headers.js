import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
	{
		value: 'name',
		locale: 'reusable.name',
		show: true,
		field: 'name',
		sort: SortSymbols.NONE,
	},
	{
		value: 'description',
		locale: 'vocabulary.description',
		show: true,
		field: 'description',
		sort: SortSymbols.NONE,
	},
	{
		value: 'initial',
		locale: 'lookups.statuses.initial',
		show: true,
		field: 'initial',
		sort: SortSymbols.NONE,
	},
	{
		value: 'final',
		locale: 'lookups.statuses.final',
		show: true,
		field: 'final',
		sort: SortSymbols.NONE,
	},
];
