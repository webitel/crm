import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
	{
		value: 'key',
		locale: [
			'vocabulary.keys',
			1,
		],
		show: true,
		field: 'key',
		sort: SortSymbols.NONE,
	},
	{
		value: 'value',
		locale: [
			'vocabulary.values',
			1,
		],
		show: true,
		field: 'value',
		sort: SortSymbols.NONE,
	},
];
